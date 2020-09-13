use super::models::{NewUser, User};
use super::schema::users::dsl::*;
use super::Pool;
use actix_web::{web, Error, HttpResponse};
use diesel::dsl::{delete, insert_into};
use diesel::{QueryDsl, RunQueryDsl};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct InputUser {
    pub user_id: String,
    pub verses: Vec<String>,
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

pub async fn get_user(db: web::Data<Pool>, other_user_id: web::Path<String>) -> Result<HttpResponse, Error> {
    Ok(web::block(move || db_get_user(db, other_user_id.into_inner()))
        .await
        .map(|user| HttpResponse::Ok().json(user))
        .map_err(|_| HttpResponse::InternalServerError())?)
}

pub fn db_get_user(pool: web::Data<Pool>, other_user_id: String) -> Result<User, diesel::result::Error> {
    let conn = pool.get().unwrap();
    users.find(other_user_id).get_result::<User>(&conn)
}

pub async fn create_user(
    db: web::Data<Pool>,
    item: web::Json<InputUser>,
) -> Result<HttpResponse, Error> {
    Ok(web::block(move || db_create_user(db, item))
        .await
        .map(|user| HttpResponse::Created().json(user))
        .map_err(|_| HttpResponse::InternalServerError())?)
}

pub fn db_create_user(
    db: web::Data<Pool>,
    item: web::Json<InputUser>,
) -> Result<User, diesel::result::Error> {
    let conn = db.get().unwrap();
    let new_user = NewUser {
        user_id: &item.user_id,
        verses: item.verses.clone(),
        created_at: chrono::Local::now().naive_local(),
    };
    let res = insert_into(users).values(&new_user).get_result(&conn)?;
    Ok(res)
}

pub async fn delete_user(
    db: web::Data<Pool>,
    other_user_id: web::Path<String>,
) -> Result<HttpResponse, Error> {
    Ok(web::block(move || db_delete_user(db, other_user_id.into_inner()))
        .await
        .map(|user| HttpResponse::Ok().json(user))
        .map_err(|_| HttpResponse::InternalServerError())?)
}

fn db_delete_user(db: web::Data<Pool>, other_user_id: String) -> Result<usize, diesel::result::Error> {
    let conn = db.get().unwrap();
    let count = delete(users.find(user_id)).execute(&conn)?;
    Ok(count)
}
