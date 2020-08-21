use actix_files as fs;
use actix_web::{web, App, Error, HttpServer, http};
use listenfd::ListenFd;
use std::path::PathBuf;
use actix_cors::Cors;

// https://www.steadylearner.com/blog/read/How-to-use-React-with-Rust-Actix

async fn index() -> Result<fs::NamedFile, Error> {
    let path: PathBuf = PathBuf::from("../zakar-client/build/index.html");
    Ok(fs::NamedFile::open(path)?)
}

#[actix_rt::main]
async fn main() -> std::io::Result<()> {
    let mut listenfd = ListenFd::from_env();
    let mut server = HttpServer::new(|| {
        App::new()
            .wrap(
                Cors::new()
                    .allowed_origin("https://api.esv.org")
                    // .allowed_methods(vec!["GET"])
                    // .allowed_headers(vec![http::header::AUTHORIZATION, http::header::ACCEPT])
                    // .allowed_header(http::header::CONTENT_TYPE)
                    .finish()
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
        server.bind("127.0.0.1:8000")?
    };

    server.run().await
}
