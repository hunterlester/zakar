use actix_web::{dev::ServiceRequest, Error, HttpResponse, web};
use actix_web::http::header;
use actix_web_httpauth::extractors::bearer::{BearerAuth, Config};
use actix_web_httpauth::extractors::AuthenticationError;
use actix_session::Session;
use alcoholic_jwt::{token_kid, validate, Validation, JWKS};
use reqwest;
use serde::{Deserialize, Serialize};
use crate::errors::ServiceError;
use oauth2::{
    AuthorizationCode, CsrfToken, PkceCodeChallenge, Scope, TokenResponse
};
use oauth2::reqwest::http_client;
use super::AppState;

#[derive(Debug, Serialize, Deserialize)]
struct Claims {
    sub: String,
    company: String,
    exp: usize,
}

#[derive(Deserialize)]
pub struct AuthRequest {
    code: String,
    state: String,
    scope: String,
}

fn fetch_jwks(uri: &str) -> Result<JWKS, Box<dyn std::error::Error>> {
    let mut res = reqwest::get(uri)?;
    let val = res.json::<JWKS>()?;
    Ok(val)
}

fn validate_token(token: &str) -> Result<bool, ServiceError> {
    println!("validate token token: {:?}", token);
    // TODO: find out why secure api endpoint /users still returning 401 after using access token
    let authority = std::env::var("AUTHORITY").expect("AUTHORITY must be set");
    let jwks = fetch_jwks(&format!("{}", authority.as_str())).expect("failed to fetch jwks");
    let validations = vec![Validation::Issuer(authority), Validation::SubjectPresent];
    let kid = match token_kid(&token) {
        Ok(res) => res.expect("failed to decode kid"),
        Err(_) => return Err(ServiceError::JWKSFetchError),
    };
    let jwk = jwks.find(&kid).expect("Specified key not found");
    let res = validate(token, jwk, validations);
    Ok(res.is_ok())
}

pub async fn validator(
    req: ServiceRequest,
    credentials: BearerAuth,
) -> Result<ServiceRequest, Error> {
    let config = req
        .app_data::<Config>()
        .map(|data| data.get_ref().clone())
        .unwrap_or_else(Default::default);

    match validate_token(credentials.token()) {
        Ok(res) => {
            if res == true {
                Ok(req)
            } else {
                Err(AuthenticationError::from(config).into())
            }
        }
        Err(_) => Err(AuthenticationError::from(config).into()),
    }
}

pub async fn login (data: web::Data<AppState>) -> HttpResponse {
    let (pkce_code_challenge, _pkce_code_verifier) = PkceCodeChallenge::new_random_sha256();

    let (authorize_url, _csrf_state) = &data
        .oauth
        .authorize_url(CsrfToken::new_random)
        .add_scope(Scope::new(
            "https://www.googleapis.com/auth/userinfo.profile".to_string(),
        ))
        // TODO: set code_verifier on session cookie, to be able to send to auth server in auth function below
        // .set_pkce_challenge(pkce_code_challenge)
        .url();


    HttpResponse::Found()
        .header(header::LOCATION, authorize_url.to_string())
        .finish()
}

pub async fn logout(session: Session) -> HttpResponse {
    session.remove("login");
    HttpResponse::Found()
        .header(header::LOCATION, "/".to_string())
        .finish()
}

pub async fn auth(
    session: Session,
    data: web::Data<AppState>,
    params: web::Query<AuthRequest>,
) -> HttpResponse {
    let code = AuthorizationCode::new(params.code.clone());
    let state = CsrfToken::new(params.state.clone());
    let _scope = params.scope.clone();

    let token = &data.oauth.exchange_code(code).request(http_client).unwrap();
    println!("token: {:?}", token.access_token().secret());

    session.set("login", true).unwrap();
    // session.set("bearer", format!("{}", token)).unwrap();

    HttpResponse::Ok().body(format!("State: Token: "))
}