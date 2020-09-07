use super::AppState;
use crate::errors::ServiceError;
use actix_session::Session;
use actix_web::http::{header, Cookie};
use actix_web::{dev::ServiceRequest, web, Error, HttpMessage, HttpRequest, HttpResponse};
use actix_web_httpauth::extractors::bearer::{BearerAuth, Config};
use actix_web_httpauth::extractors::AuthenticationError;
use alcoholic_jwt::{token_kid, validate, Validation, JWKS};
use reqwest;
use serde::{Deserialize, Serialize};

use openidconnect::core::CoreResponseType;
use openidconnect::reqwest::http_client;
use openidconnect::{AuthenticationFlow, AuthorizationCode, CsrfToken, Nonce, Scope};

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
    let authority = std::env::var("AUTHORITY").expect("AUTHORITY must be set");
    let jwks = fetch_jwks(&format!("{}", authority.as_str())).expect("failed to fetch jwks");
    let validations = vec![
        Validation::Issuer("https://accounts.google.com".to_string()),
        Validation::SubjectPresent,
    ];
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

    if req.path().starts_with("/proxy") {
        return Ok(req);
    }

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

pub async fn login(data: web::Data<AppState>) -> HttpResponse {
    let (authorize_url, _csrf_state, _nonce) = &data
        .oauth
        .authorize_url(
            AuthenticationFlow::<CoreResponseType>::AuthorizationCode,
            CsrfToken::new_random,
            Nonce::new_random,
        )
        .add_scope(Scope::new("openid".to_string()))
        .add_scope(Scope::new("email".to_string()))
        .url();

    HttpResponse::Found()
        .header(header::LOCATION, authorize_url.to_string())
        .finish()
}

pub async fn logout(session: Session, req: HttpRequest) -> HttpResponse {
    session.remove("login");
    session.remove("bearer");

    let mut builder = HttpResponse::Found();
    if let Some(ref cookie) = req.cookie("bearer") {
        builder.del_cookie(cookie);
    }
    if let Some(ref cookie) = req.cookie("login") {
        builder.del_cookie(cookie);
    }
    builder.header(header::LOCATION, "/".to_string()).finish()
}

pub async fn auth(
    session: Session,
    data: web::Data<AppState>,
    params: web::Query<AuthRequest>,
) -> HttpResponse {
    let code = AuthorizationCode::new(params.code.clone());
    let _state = CsrfToken::new(params.state.clone());
    let _scope = params.scope.clone();

    let token = &data.oauth.exchange_code(code).request(http_client).unwrap();
    if let Some(token) = token.extra_fields().id_token() {
        println!("token: {:?}", token);
        println!("token: {:?}", token.to_string());
        session
            .set("bearer", format!("{}", token.to_string()))
            .unwrap();
    }

    session.set("login", true).unwrap();

    HttpResponse::Found()
        .header(header::LOCATION, "/".to_string())
        .cookie(
            Cookie::build(
                "bearer",
                token.extra_fields().id_token().unwrap().to_string(),
            )
            .finish(),
        )
        .cookie(Cookie::build("login", "true").finish())
        .finish()
}
