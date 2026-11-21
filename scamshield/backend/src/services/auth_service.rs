use std::sync::Arc;
use chrono::{Duration, Utc};
use uuid::Uuid;

use crate::{
    config::Config,
    dto::auth_dto::{AuthResponse, LoginRequest, RegisterRequest, UserResponse},
    error::{AppError, AppResult},
    repositories::UserRepository,
    utils::{
        generate_access_token, generate_refresh_token, hash_token,
        password::{hash_password, verify_password},
    },
};

pub struct AuthService {
    user_repo: UserRepository,
    config: Arc<Config>,
}

impl AuthService {
    pub fn new(user_repo: UserRepository, config: Arc<Config>) -> Self {
        Self { user_repo, config }
    }

    pub async fn register(&self, req: RegisterRequest) -> AppResult<AuthResponse> {
        // Check if user already exists
        if self.user_repo.find_by_email(&req.email).await?.is_some() {
            return Err(AppError::Conflict("Email is already registered".to_string()));
        }

        let password_hash = hash_password(&req.password)?;
        let user = self.user_repo.create(&req.name, &req.email, &password_hash).await?;

        self.create_auth_response(user).await
    }

    pub async fn login(&self, req: LoginRequest) -> AppResult<AuthResponse> {
        let user = self
            .user_repo
            .find_by_email(&req.email)
            .await?
            .ok_or_else(|| AppError::Unauthorized("Invalid email or password".to_string()))?;

        if !verify_password(&req.password, &user.password_hash)? {
            return Err(AppError::Unauthorized("Invalid email or password".to_string()));
        }

        self.create_auth_response(user).await
    }

    pub async fn refresh_token(&self, raw_token: &str) -> AppResult<AuthResponse> {
        let token_hash = hash_token(raw_token);

        let (user_id, expires_at, revoked_at) = self
            .user_repo
            .find_refresh_token(&token_hash)
            .await?
            .ok_or_else(|| AppError::Unauthorized("Invalid refresh token".to_string()))?;

        if revoked_at.is_some() {
            return Err(AppError::Unauthorized("Refresh token has been revoked".to_string()));
        }

        if expires_at < Utc::now() {
            return Err(AppError::Unauthorized("Refresh token has expired".to_string()));
        }

        // Revoke old token
        self.user_repo.revoke_refresh_token(&token_hash).await?;

        let user = self
            .user_repo
            .find_by_id(user_id)
            .await?
            .ok_or_else(|| AppError::NotFound("User not found".to_string()))?;

        self.create_auth_response(user).await
    }

    pub async fn logout(&self, user_id: Uuid) -> AppResult<()> {
        self.user_repo.revoke_all_user_tokens(user_id).await
    }

    async fn create_auth_response(&self, user: crate::models::User) -> AppResult<AuthResponse> {
        let access_token = generate_access_token(
            user.id,
            &user.email,
            &user.role,
            &self.config.jwt_secret,
            self.config.jwt_access_expiry_seconds,
        )?;

        let refresh_token = generate_refresh_token();
        let token_hash = hash_token(&refresh_token);
        let expires_at = Utc::now() + Duration::seconds(self.config.jwt_refresh_expiry_seconds);

        self.user_repo
            .store_refresh_token(user.id, &token_hash, expires_at)
            .await?;

        Ok(AuthResponse {
            access_token,
            refresh_token,
            token_type: "Bearer".to_string(),
            expires_in: self.config.jwt_access_expiry_seconds,
            user: UserResponse {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                created_at: user.created_at,
            },
        })
    }
}

