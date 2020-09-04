use actix_web::{Error, HttpResponse, web};
use serde::{Deserialize, Serialize};
use super::Pool;
use super::models::{User, NewUser};
use super::schema::users::dsl::*;
use diesel::{RunQueryDsl, QueryDsl};
use diesel::dsl::{delete, insert_into};


#[derive(Debug, Serialize, Deserialize)]
pub struct InputUser {
    pub email: String,
}

pub async fn get_users(db: web::Data<Pool>) -> Result<HttpResponse, Error> {
    Ok(web::block(move || db_get_all_users(db))
        .await
        .map(|user| HttpResponse::Ok().json(user))
        .map_err(|_| HttpResponse::InternalServerError())?)
}

fn db_get_all_users(pool: web::Data<Pool>) -> Result<Vec<User>, diesel::result::Error> {
    let conn = pool.get().unwrap();
    let items = users.load::<User>(&conn)?;
    Ok(items)
}

pub async fn get_user(db: web::Data<Pool>, user_id: web::Path<i32>) -> Result<HttpResponse, Error> {
    Ok(
        web::block(move || db_get_user(db, user_id.into_inner()))
            .await
            .map(|user| HttpResponse::Ok().json(user))
            .map_err(|_| HttpResponse::InternalServerError())?,
    )
}

fn db_get_user(pool: web::Data<Pool>, user_id: i32) -> Result<User, diesel::result::Error> {
    let conn = pool.get().unwrap();
    users.find(user_id).get_result::<User>(&conn)
}

pub async fn create_user(db: web::Data<Pool>, item: web::Json<InputUser>) -> Result<HttpResponse, Error> {
    Ok(
        web::block(move || db_create_user(db, item))
            .await
            .map(|user| HttpResponse::Created().json(user))
            .map_err(|_| HttpResponse::InternalServerError())?
    )
}

fn db_create_user(db: web::Data<Pool>, item: web::Json<InputUser>) -> Result<User, diesel::result::Error> {
  let conn = db.get().unwrap();
  let new_user = NewUser {
    email: &item.email,
    created_at: chrono::Local::now().naive_local(),
  };
  let res = insert_into(users).values(&new_user).get_result(&conn)?;
  Ok(res)
}

pub async fn delete_user(db: web::Data<Pool>, user_id: web::Path<i32>) -> Result<HttpResponse, Error> {
    Ok(
        web::block(move || db_delete_user(db, user_id.into_inner()))
            .await
            .map(|user| HttpResponse::Ok().json(user))
            .map_err(|_| HttpResponse::InternalServerError())?
    )
}

fn db_delete_user(db: web::Data<Pool>, user_id: i32) -> Result<usize, diesel::result::Error> {
    let conn = db.get().unwrap();
    let count = delete(users.find(user_id)).execute(&conn)?;
    Ok(count)
}
