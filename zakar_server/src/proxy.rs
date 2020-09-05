use actix_web::{self, client, Error, HttpRequest, HttpResponse};
use std::env;

static ESV_PREFIX: &str = "https://api.esv.org/v3/passage";

pub async fn forward_request(req: HttpRequest) -> Result<HttpResponse, Error> {
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
        Err(_e) => {
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
