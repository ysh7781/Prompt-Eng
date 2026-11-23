use std::env;

#[derive(Debug, Clone)]
pub struct Config {
    pub database_url: String,
    pub jwt_secret: String,
    pub jwt_access_expiry_seconds: i64,
    pub jwt_refresh_expiry_seconds: i64,
    pub frontend_origin: String,
    pub host: String,
    pub port: u16,
    pub gemini_api_key: Option<String>,
}

impl Config {
    pub fn from_env() -> anyhow::Result<Self> {
        Ok(Config {
            database_url: env::var("DATABASE_URL")
                .map_err(|_| anyhow::anyhow!("DATABASE_URL must be set"))?,
            jwt_secret: env::var("JWT_SECRET")
                .map_err(|_| anyhow::anyhow!("JWT_SECRET must be set"))?,
            jwt_access_expiry_seconds: env::var("JWT_ACCESS_TOKEN_EXPIRY")
                .unwrap_or_else(|_| "900".to_string())
                .parse()
                .unwrap_or(900),
            jwt_refresh_expiry_seconds: env::var("JWT_REFRESH_TOKEN_EXPIRY")
                .unwrap_or_else(|_| "604800".to_string())
                .parse()
                .unwrap_or(604800),
            frontend_origin: env::var("FRONTEND_ORIGIN")
                .unwrap_or_else(|_| "http://localhost:5173".to_string()),
            host: env::var("HOST").unwrap_or_else(|_| "0.0.0.0".to_string()),
            port: env::var("PORT")
                .unwrap_or_else(|_| "8080".to_string())
                .parse()
                .unwrap_or(8080),
            gemini_api_key: env::var("GEMINI_API_KEY")
                .ok()
                .map(|k| k.trim().to_string())
                .filter(|k| !k.is_empty()),
        })
    }
}

