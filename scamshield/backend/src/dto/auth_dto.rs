use serde::{Deserialize, Serialize};
use uuid::Uuid;
use chrono::{DateTime, Utc};
use validator::Validate;

#[derive(Debug, Deserialize, Validate)]
pub struct RegisterRequest {
    #[validate(length(min = 2, max = 100, message = "Name must be between 2 and 100 characters"))]
    pub name: String,
    #[validate(email(message = "Invalid email address"))]
    pub email: String,
    #[validate(length(min = 8, message = "Password must be at least 8 characters"))]
    pub password: String,
}

#[derive(Debug, Deserialize, Validate)]
pub struct LoginRequest {
    #[validate(email(message = "Invalid email address"))]
    pub email: String,
    pub password: String,
}

#[derive(Debug, Deserialize, Default)]
pub struct RefreshTokenRequest {
    pub refresh_token: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct AuthResponse {
    pub access_token: String,
    pub refresh_token: String,
    pub token_type: String,
    pub expires_in: i64,
    pub user: UserResponse,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct UserResponse {
    pub id: Uuid,
    pub name: String,
    pub email: String,
    pub role: String,
    pub created_at: DateTime<Utc>,
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_register_request_validation_success() {
        let req = RegisterRequest {
            name: "Alice Smith".to_string(),
            email: "alice@example.com".to_string(),
            password: "SecurePassword123!".to_string(),
        };
        assert!(req.validate().is_ok());
    }

    #[test]
    fn test_register_request_short_name() {
        let req = RegisterRequest {
            name: "A".to_string(),
            email: "alice@example.com".to_string(),
            password: "SecurePassword123!".to_string(),
        };
        assert!(req.validate().is_err());
    }

    #[test]
    fn test_register_request_invalid_email() {
        let req = RegisterRequest {
            name: "Alice Smith".to_string(),
            email: "not-an-email".to_string(),
            password: "SecurePassword123!".to_string(),
        };
        assert!(req.validate().is_err());
    }

    #[test]
    fn test_register_request_short_password() {
        let req = RegisterRequest {
            name: "Alice Smith".to_string(),
            email: "alice@example.com".to_string(),
            password: "short".to_string(),
        };
        assert!(req.validate().is_err());
    }

    #[test]
    fn test_login_request_validation_success() {
        let req = LoginRequest {
            email: "bob@example.com".to_string(),
            password: "password123".to_string(),
        };
        assert!(req.validate().is_ok());
    }

    #[test]
    fn test_login_request_invalid_email() {
        let req = LoginRequest {
            email: "invalid-email".to_string(),
            password: "password123".to_string(),
        };
        assert!(req.validate().is_err());
    }
}
