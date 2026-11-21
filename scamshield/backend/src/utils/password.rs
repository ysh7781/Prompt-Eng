use argon2::{
    password_hash::{rand_core::OsRng, PasswordHash, PasswordHasher, PasswordVerifier, SaltString},
    Algorithm, Argon2, Params, Version,
};
use crate::error::{AppError, AppResult};

/// Hash a plaintext password using Argon2id with random salt and standard parameters.
pub fn hash_password(password: &str) -> AppResult<String> {
    let salt = SaltString::generate(&mut OsRng);
    let argon2 = Argon2::new(Algorithm::Argon2id, Version::V0x13, Params::default());
    argon2
        .hash_password(password.as_bytes(), &salt)
        .map(|hash| hash.to_string())
        .map_err(|e| AppError::InternalServerError(format!("Failed to hash password: {}", e)))
}

/// Verify a plaintext password against an Argon2id password hash string.
/// Returns Ok(false) if the password does not match or the hash string is malformed.
pub fn verify_password(password: &str, hash: &str) -> AppResult<bool> {
    let parsed_hash = match PasswordHash::new(hash) {
        Ok(h) => h,
        Err(_) => return Ok(false),
    };
    let argon2 = Argon2::new(Algorithm::Argon2id, Version::V0x13, Params::default());
    Ok(argon2
        .verify_password(password.as_bytes(), &parsed_hash)
        .is_ok())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_hash_password_produces_argon2id_format() {
        let password = "SecurePassword123!";
        let hash = hash_password(password).expect("Hashing should succeed");
        assert!(hash.starts_with("$argon2id$"), "Hash should use Argon2id: {}", hash);
    }

    #[test]
    fn test_verify_password_correct() {
        let password = "SuperSecretPassword#2024";
        let hash = hash_password(password).expect("Hashing should succeed");
        let valid = verify_password(password, &hash).expect("Verification should succeed");
        assert!(valid, "Correct password must verify as true");
    }

    #[test]
    fn test_verify_password_incorrect() {
        let password = "CorrectPassword123";
        let hash = hash_password(password).expect("Hashing should succeed");
        let valid = verify_password("WrongPassword456", &hash).expect("Verification should succeed");
        assert!(!valid, "Incorrect password must verify as false");
    }

    #[test]
    fn test_verify_password_invalid_hash() {
        let valid = verify_password("AnyPassword", "not-a-valid-argon2-hash")
            .expect("Verification should handle invalid hash gracefully");
        assert!(!valid, "Invalid hash string must return false");
    }

    #[test]
    fn test_hash_password_random_salt() {
        let password = "IdenticalPassword!";
        let hash1 = hash_password(password).expect("Hash 1 should succeed");
        let hash2 = hash_password(password).expect("Hash 2 should succeed");
        assert_ne!(hash1, hash2, "Distinct salts must produce distinct hashes");
        assert!(verify_password(password, &hash1).unwrap());
        assert!(verify_password(password, &hash2).unwrap());
    }

    #[test]
    fn test_empty_password() {
        let password = "";
        let hash = hash_password(password).expect("Empty password hashing should succeed");
        assert!(verify_password("", &hash).unwrap());
        assert!(!verify_password("not-empty", &hash).unwrap());
    }
}
