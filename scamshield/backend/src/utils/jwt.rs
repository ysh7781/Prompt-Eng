use chrono::{Duration, Utc};
use jsonwebtoken::{decode, encode, DecodingKey, EncodingKey, Header, Validation};
use rand::Rng;
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use uuid::Uuid;

use crate::error::{AppError, AppResult};

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct Claims {
    pub sub: Uuid,
    pub email: String,
    pub role: String,
    pub exp: i64,
    pub iat: i64,
}

/// Generates a signed JWT access token containing standard claims.
pub fn generate_access_token(
    user_id: Uuid,
    email: &str,
    role: &str,
    secret: &str,
    expiry_seconds: i64,
) -> AppResult<String> {
    let now = Utc::now();
    let exp = now + Duration::seconds(expiry_seconds);
    let claims = Claims {
        sub: user_id,
        email: email.to_string(),
        role: role.to_string(),
        exp: exp.timestamp(),
        iat: now.timestamp(),
    };

    encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_secret(secret.as_bytes()),
    )
    .map_err(|e| AppError::InternalServerError(format!("Failed to generate token: {}", e)))
}

/// Verifies and decodes a JWT access token using the provided secret key.
pub fn verify_access_token(token: &str, secret: &str) -> AppResult<Claims> {
    decode::<Claims>(
        token,
        &DecodingKey::from_secret(secret.as_bytes()),
        &Validation::default(),
    )
    .map(|data| data.claims)
    .map_err(|e| match e.kind() {
        jsonwebtoken::errors::ErrorKind::ExpiredSignature => {
            AppError::Unauthorized("Token has expired".to_string())
        }
        _ => AppError::Unauthorized(format!("Invalid token: {}", e)),
    })
}

/// Generates a cryptographically secure random 64-byte hex string (128 hex chars).
pub fn generate_refresh_token() -> String {
    let mut rng = rand::thread_rng();
    let bytes: Vec<u8> = (0..64).map(|_| rng.gen::<u8>()).collect();
    hex::encode(bytes)
}

/// Computes SHA-256 hash of a refresh token for secure database storage.
pub fn hash_token(token: &str) -> String {
    let mut hasher = Sha256::new();
    hasher.update(token.as_bytes());
    hex::encode(hasher.finalize())
}

#[cfg(test)]
mod tests {
    use super::*;

    const TEST_SECRET: &str = "test_super_secret_jwt_key_that_is_long_enough_123456";

    #[test]
    fn test_generate_and_verify_access_token() {
        let user_id = Uuid::new_v4();
        let email = "security@scamshield.local";
        let role = "admin";

        let token = generate_access_token(user_id, email, role, TEST_SECRET, 900)
            .expect("Token generation should succeed");
        assert!(!token.is_empty());

        let claims = verify_access_token(&token, TEST_SECRET)
            .expect("Token verification should succeed");
        assert_eq!(claims.sub, user_id);
        assert_eq!(claims.email, email);
        assert_eq!(claims.role, role);
        assert!(claims.exp > claims.iat);
    }

    #[test]
    fn test_expired_access_token() {
        let user_id = Uuid::new_v4();
        let email = "user@scamshield.local";
        let role = "user";

        // Expired 120 seconds in the past to exceed jsonwebtoken's default 60s leeway
        let token = generate_access_token(user_id, email, role, TEST_SECRET, -120)
            .expect("Token generation should succeed");

        let result = verify_access_token(&token, TEST_SECRET);
        assert!(result.is_err());
        match result.unwrap_err() {
            AppError::Unauthorized(msg) => {
                assert!(msg.contains("expired"), "Error message should mention expiration: {}", msg);
            }
            err => panic!("Expected AppError::Unauthorized, got: {:?}", err),
        }
    }

    #[test]
    fn test_invalid_signature_different_secret() {
        let user_id = Uuid::new_v4();
        let token = generate_access_token(user_id, "u@test.local", "user", TEST_SECRET, 900)
            .expect("Token generation should succeed");

        let result = verify_access_token(&token, "wrong_secret_key_used_to_verify_12345678");
        assert!(result.is_err());
        match result.unwrap_err() {
            AppError::Unauthorized(msg) => {
                assert!(msg.contains("Invalid token"), "Should indicate invalid token: {}", msg);
            }
            err => panic!("Expected AppError::Unauthorized, got: {:?}", err),
        }
    }

    #[test]
    fn test_malformed_token() {
        let result = verify_access_token("this.is.not.a.valid.jwt", TEST_SECRET);
        assert!(result.is_err());
        match result.unwrap_err() {
            AppError::Unauthorized(_) => {}
            err => panic!("Expected AppError::Unauthorized, got: {:?}", err),
        }
    }

    #[test]
    fn test_generate_refresh_token_entropy_and_format() {
        let token1 = generate_refresh_token();
        let token2 = generate_refresh_token();

        assert_eq!(token1.len(), 128, "64 bytes hex-encoded must be 128 chars");
        assert_eq!(token2.len(), 128);
        assert_ne!(token1, token2, "Successive refresh tokens must be unique");
        assert!(token1.chars().all(|c| c.is_ascii_hexdigit()));
    }

    #[test]
    fn test_hash_token_sha256() {
        let token = "test_refresh_token_payload_value";
        let hash1 = hash_token(token);
        let hash2 = hash_token(token);

        assert_eq!(hash1, hash2, "Hashing must be deterministic");
        assert_eq!(hash1.len(), 64, "SHA-256 hex string must be 64 characters");
        assert_ne!(hash1, token);
    }
}
