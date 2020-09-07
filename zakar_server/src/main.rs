#[macro_use]
extern crate diesel;

extern crate dotenv;

use actix_files as fs;
use actix_session::{CookieSession, Session};
use actix_web::{self, web, App, Error, HttpServer};
use actix_web_httpauth::middleware::HttpAuthentication;
use diesel::prelude::*;
use diesel::r2d2::{self, ConnectionManager};
use listenfd::ListenFd;
use std::env;
use std::net::SocketAddr;
use std::path::PathBuf;

use openidconnect::core::{CoreClient, CoreProviderMetadata};
use openidconnect::reqwest::http_client;
use openidconnect::{ClientId, ClientSecret, IssuerUrl, RedirectUrl};

mod auth;
mod errors;
mod models;
mod proxy;
mod schema;
mod user_api;

pub type Pool = r2d2::Pool<ConnectionManager<PgConnection>>;

pub struct AppState {
    pub oauth: CoreClient,
}

// https://www.steadylearner.com/blog/read/How-to-use-React-with-Rust-Actix

pub async fn index() -> Result<fs::NamedFile, Error> {
    let path: PathBuf = PathBuf::from("../zakar-client/build/index.html");
    Ok(fs::NamedFile::open(path)?)
}

fn get_server_port() -> u16 {
    env::var("PORT")
        .ok()
        .and_then(|p| p.parse().ok())
        .unwrap_or(8000)
}

#[actix_rt::main]
async fn main() -> std::io::Result<()> {
    dotenv::dotenv().ok();
    env::set_var("RUST_LOG", "actix_web=debug");
    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");

    let manager = ConnectionManager::<PgConnection>::new(database_url);
    let pool: Pool = r2d2::Pool::builder()
        .build(manager)
        .expect("Failed to create connection pool");

    let mut listenfd = ListenFd::from_env();
    let addr = SocketAddr::from(([0, 0, 0, 0], get_server_port()));

    let mut server = HttpServer::new(move || {
        let auth = HttpAuthentication::bearer(auth::validator);

        let google_client_id =
            ClientId::new(env::var("GOOGLE_CLIENT_ID").expect("Missing GOOGLE_CLIENT_ID"));
        let google_client_secret = ClientSecret::new(
            env::var("GOOGLE_CLIENT_SECRET").expect("Missing GOOGLE_CLIENT_SECRET"),
        );

        let issuer_url =
            IssuerUrl::new("https://accounts.google.com".to_string()).expect("Invalid issuer URL");

        let provider_metadata = CoreProviderMetadata::discover(&issuer_url, http_client)
            .expect("Failed to discover OpenID provider");

        let client = CoreClient::from_provider_metadata(
            provider_metadata,
            google_client_id,
            Some(google_client_secret),
        )
        .set_redirect_uri(
            RedirectUrl::new("http://localhost:8000/redirect".to_string())
                .expect("Invalid redirect URL"),
        );

        App::new()
            .data(pool.clone())
            .data(AppState { oauth: client })
            .wrap(CookieSession::signed(&[0; 32]).secure(false))
            .route("/", web::get().to(index))
            .route("/login", web::get().to(auth::login))
            .route("/logout", web::get().to(auth::logout))
            .route("/redirect", web::get().to(auth::auth))
            .route("/learning-board", web::get().to(index))
            .route("/about", web::get().to(index))
            .route("/global", web::get().to(index))
            .service(
                web::scope("/proxy/")
                    .wrap(auth.clone())
                    .service(web::resource("/search/").route(web::get().to(proxy::forward_request)))
                    .service(web::resource("/html/").route(web::get().to(proxy::forward_request)))
                    .service(web::resource("/text/").route(web::get().to(proxy::forward_request)))
                    .service(web::resource("/audio/").route(web::get().to(proxy::forward_request))),
            )
            .service(
                web::scope("/users")
                    .wrap(auth.clone())
                    .service(
                        web::resource("")
                            .route(web::get().to(user_api::get_users))
                            .route(web::post().to(user_api::create_user)),
                    )
                    .service(
                        web::resource("/{id}")
                            .route(web::get().to(user_api::get_user))
                            .route(web::delete().to(user_api::delete_user)),
                    ),
            )
            .service(fs::Files::new("/", "../zakar-client/build").index_file("index.html"))
    });

    server = if let Some(listener) = listenfd.take_tcp_listener(0).unwrap() {
        server.listen(listener)?
    } else {
        server.bind(addr)?
    };

    server.run().await
}
