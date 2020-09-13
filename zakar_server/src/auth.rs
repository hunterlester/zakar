use super::AppState;
use crate::errors::ServiceError;
use actix_session::Session;
use actix_web::http::{header, Cookie};
use actix_web::{dev::ServiceRequest, web, Error, HttpMessage, HttpRequest, HttpResponse, error};
use actix_web_httpauth::extractors::bearer::{BearerAuth, Config};
use actix_web_httpauth::extractors::AuthenticationError;
use alcoholic_jwt::{token_kid, validate, Validation, JWKS};
use reqwest;
use serde::{Deserialize, Serialize};
use crate::Pool;
use crate::user_api::{db_create_user, InputUser};

use openidconnect::core::CoreResponseType;
use openidconnect::reqwest::http_client;
use openidconnect::{AuthenticationFlow, AuthorizationCode, CsrfToken, Nonce, Scope, PkceCodeChallenge};

use tiny_keccak::{Sha3, Hasher};
use zeros::bytes_to_hex;

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

pub async fn login(session: Session, data: web::Data<AppState>) -> Result<HttpResponse, Error> {
    let (pkce_challenge, pkce_verifier) = PkceCodeChallenge::new_random_sha256();

    let (authorize_url, csrf_state, nonce) = &data
        .oauth
        .authorize_url(
            AuthenticationFlow::<CoreResponseType>::AuthorizationCode,
            CsrfToken::new_random,
            Nonce::new_random,
        )
        .add_scope(Scope::new("openid".to_string()))
        .add_scope(Scope::new("email".to_string()))
        .set_pkce_challenge(pkce_challenge)
        .url();

    session.set("csrf_state", csrf_state)?;
    session.set("nonce", nonce)?;
    session.set("pkce_verifier", pkce_verifier)?;

    Ok(HttpResponse::Found()
        .header(header::LOCATION, authorize_url.to_string())
        .finish())
}

pub async fn logout(session: Session, req: HttpRequest) -> Result<HttpResponse, Error> {
    session.remove("bearer");

    let mut builder = HttpResponse::Found();
    if let Some(ref cookie) = req.cookie("bearer") {
        builder.del_cookie(cookie);
    }
    if let Some(ref cookie) = req.cookie("user_id") {
        builder.del_cookie(cookie);
    }
    Ok(builder.header(header::LOCATION, "/".to_string()).finish())
}

pub async fn auth(
    session: Session,
    data: web::Data<AppState>,
    pool: web::Data<Pool>,
    params: web::Query<AuthRequest>,
) -> Result<HttpResponse, Error> {
    let code = AuthorizationCode::new(params.code.clone());
    let state = CsrfToken::new(params.state.clone());
    let _scope = params.scope.clone();

    let token = &data.oauth.exchange_code(code).set_pkce_verifier(session.get("pkce_verifier").unwrap().unwrap()).request(http_client).unwrap();
    let (token_string, email_string): (String, String)  = if let Some(token) = token.extra_fields().id_token() {
        let csrf: CsrfToken = session.get("csrf_state").unwrap().unwrap();

        if state.secret() != csrf.secret() {
          return Err(error::ErrorForbidden("Bad Csrf"));
        }

        let nonce: Nonce = if let Some(nonce) = session.get("nonce")? {
            nonce
        } else {
            Nonce::new_random() 
        };
        let claims = token.claims(&data.oauth.id_token_verifier(), &nonce).unwrap();
        session
            .set("bearer", format!("{}", token.to_string()))
            .unwrap();

        (token.to_string(), claims.email().unwrap().as_str().to_string())
    } else { panic!("panic")};

    let mut output = [0; 32];
    let mut sha3 = Sha3::v256();
    sha3.update(email_string.as_bytes());
    sha3.finalize(&mut output);

    // TODO: only create new user if not exist 
    let new_user = InputUser {
        user_id: bytes_to_hex(&output),
        verses: vec![],
    };

    web::block(move || db_create_user(pool, web::Json(new_user)))
        .await
        .map(|user| HttpResponse::Ok().json(user))
        .map_err(|_| HttpResponse::InternalServerError())?;

    Ok(HttpResponse::Found()
        .header(header::LOCATION, "/".to_string())
        .cookie(
            Cookie::build(
                "bearer",
                token_string,
            )
            .finish(),
        )
        .cookie(
            Cookie::build(
                "user_id",
                bytes_to_hex(&output),
            )
            .finish(),
        )
        .finish())
}
