use actix_web::Responder;

pub async fn get_users() -> impl Responder {
    println!("get users");
    format!("get users")
}

pub async fn get_user() -> impl Responder {
    println!("get single user");
    format!("get single user")
}

pub async fn delete_user() -> impl Responder {
    println!("delete user");
    format!("delete user")
}

pub async fn create_user() -> impl Responder {
    println!("create user");
    format!("create user")
}