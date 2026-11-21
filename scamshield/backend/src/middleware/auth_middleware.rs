use axum::{
    body::Body,
    extract::{Request, State},
    http::header::AUTHORIZATION,
    middleware::Next,
    response::Response,
};

use crate::{
    error::AppError,
    state::AppState,
    utils::verify_access_token,
};

pub async fn auth_required(
    State(state): State<AppState>,
    mut req: Request<Body>,
    next: Next,
) -> Result<Response, AppError> {
    let auth_header = req
        .headers()
        .get(AUTHORIZATION)
        .and_then(|value| value.to_str().ok());

    let token = match auth_header {
        Some(header) if header.starts_with("Bearer ") => &header["Bearer ".len()..],
        _ => return Err(AppError::Unauthorized("Missing or invalid Authorization header".to_string())),
    };

    let claims = verify_access_token(token, &state.config.jwt_secret)?;
    req.extensions_mut().insert(claims);

    Ok(next.run(req).await)
}

pub async fn admin_required(
    State(state): State<AppState>,
    mut req: Request<Body>,
    next: Next,
) -> Result<Response, AppError> {
    let auth_header = req
        .headers()
        .get(AUTHORIZATION)
        .and_then(|value| value.to_str().ok());

    let token = match auth_header {
        Some(header) if header.starts_with("Bearer ") => &header["Bearer ".len()..],
        _ => return Err(AppError::Unauthorized("Missing or invalid Authorization header".to_string())),
    };

    let claims = verify_access_token(token, &state.config.jwt_secret)?;

    if claims.role != "admin" {
        return Err(AppError::Forbidden("Admin access required".to_string()));
    }

    req.extensions_mut().insert(claims);
    Ok(next.run(req).await)
}

