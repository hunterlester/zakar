use crate::schema::*;
use serde::{Deserialize, Serialize};
use diesel::Identifiable;

#[derive(Debug, Serialize, Deserialize, Queryable, Identifiable)]
#[primary_key(user_id)]
pub struct User {
    pub id: i32,
    pub user_id: String,
    pub verses: Vec<String>,
    pub created_at: chrono::NaiveDateTime,
}

#[derive(Insertable, Debug)]
#[table_name = "users"]
pub struct NewUser<'a> {
    pub user_id: &'a str,
    pub verses: Vec<String>,
    pub created_at: chrono::NaiveDateTime,
}
