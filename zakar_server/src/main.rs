use actix_files as fs;
use actix_web::{self, web, App, Error, HttpServer};
use listenfd::ListenFd;
use std::env;
use std::net::SocketAddr;
use std::path::PathBuf;

mod user_api;
mod proxy;

// https://www.steadylearner.com/blog/read/How-to-use-React-with-Rust-Actix

async fn index() -> Result<fs::NamedFile, Error> {
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
    let mut listenfd = ListenFd::from_env();
    let addr = SocketAddr::from(([0, 0, 0, 0], get_server_port()));
    let mut server = HttpServer::new(|| {
        App::new()
            .service(
                web::scope("/proxy/")
                    .service(web::resource("/search/").route(web::get().to(proxy::forward_request)))
                    .service(web::resource("/html/").route(web::get().to(proxy::forward_request)))
                    .service(web::resource("/text/").route(web::get().to(proxy::forward_request)))
                    .service(web::resource("/audio/").route(web::get().to(proxy::forward_request))),
            )
            .service(
                web::scope("/users")
                    .service(
                        web::resource("")
                        .route(web::get().to(user_api::get_users))
                        .route(web::post().to(user_api::create_user))
                    )
                    .service(
                        web::resource("/{id}")
                        .route(web::get().to(user_api::get_user))
                        .route(web::delete().to(user_api::delete_user))
                    )
            )
            .route("/", web::get().to(index))
            .route("/login", web::get().to(index))
            .route("/learning-board", web::get().to(index))
            .route("/about", web::get().to(index))
            .route("/global", web::get().to(index))
            .service(fs::Files::new("/", "../zakar-client/build").index_file("index.html"))
    });

    server = if let Some(listener) = listenfd.take_tcp_listener(0).unwrap() {
        server.listen(listener)?
    } else {
        server.bind(addr)?
    };

    server.run().await
}
