use actix_web::{web, App, HttpResponse, HttpServer, Responder};

// https://www.steadylearner.com/blog/read/How-to-use-React-with-Rust-Actix

async fn index() -> impl Responder {
    HttpResponse::Ok().body("Hello world")
}

#[actix_rt::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        App::new()
          .route("/",web::get().to(index))
    })
    .bind("127.0.0.1:8088")?
    .run()
    .await
}
