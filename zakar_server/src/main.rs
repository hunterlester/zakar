use actix_files as fs;
use actix_web::{self, client, web, App, Error, HttpRequest, HttpResponse, HttpServer};
use listenfd::ListenFd;
use std::env;
use std::net::SocketAddr;
use std::path::PathBuf;

static ESV_PREFIX: &str = "https://api.esv.org/v3/passage";

// https://www.steadylearner.com/blog/read/How-to-use-React-with-Rust-Actix

async fn index() -> Result<fs::NamedFile, Error> {
    let path: PathBuf = PathBuf::from("../zakar-client/build/index.html");
    Ok(fs::NamedFile::open(path)?)
}

async fn forward_request(req: HttpRequest) -> Result<HttpResponse, Error> {
    let client = client::Client::default();
    let request_path = String::from(req.path());
    let mut path = request_path.split("/").collect::<Vec<&str>>();
    // println!("path: {:?}", path);
    path.remove(0);
    path.remove(0);
    path.pop();
    // println!("after path: {:?}", path);

    let bearer_token = match env::var("ESV_API_KEY") {
        Ok(token) => token,
        Err(e) => {
            // TODO: fix incorrect error handling
            return HttpResponse::Forbidden().await;
        }
    };
    // println!("{}/{}/?{}", ESV_PREFIX, path.join("/"), req.query_string());
    let mut response = client
        .get(format!(
            "{}/{}/?{}",
            ESV_PREFIX,
            path.join("/"),
            req.query_string()
        ))
        .header("Authorization", format!("Token {}", bearer_token))
        .send()
        .await
        .map_err(Error::from)?;

    let mut client_resp = HttpResponse::build(response.status());
    // Remove `Connection` as per
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Connection#Directives
    for (header_name, header_value) in response
        .headers()
        .iter()
        .filter(|(h, _)| *h != "connection")
    {
        client_resp.header(header_name.clone(), header_value.clone());
    }

    Ok(client_resp.body(response.body().await?))
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
                    .service(web::resource("/search/").route(web::get().to(forward_request)))
                    .service(web::resource("/html/").route(web::get().to(forward_request)))
                    .service(web::resource("/text/").route(web::get().to(forward_request)))
                    .service(web::resource("/audio/").route(web::get().to(forward_request))),
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
