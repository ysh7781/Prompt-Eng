use sqlx::PgPool;
use uuid::Uuid;
use chrono::{DateTime, Utc};

use crate::{
    error::AppResult,
    models::User,
};

pub struct UserRepository {
    db: PgPool,
}

impl UserRepository {
    pub fn new(db: PgPool) -> Self {
        Self { db }
    }

    pub async fn create(&self, name: &str, email: &str, password_hash: &str) -> AppResult<User> {
        let user = sqlx::query_as::<_, User>(
            r#"
            INSERT INTO users (name, email, password_hash)
            VALUES ($1, $2, $3)
            RETURNING id, name, email, password_hash, role, created_at, updated_at
            "#
        )
        .bind(name)
        .bind(email)
        .bind(password_hash)
        .fetch_one(&self.db)
        .await?;

        Ok(user)
    }

    pub async fn find_by_email(&self, email: &str) -> AppResult<Option<User>> {
        let user = sqlx::query_as::<_, User>(
            "SELECT id, name, email, password_hash, role, created_at, updated_at FROM users WHERE email = $1"
        )
        .bind(email)
        .fetch_optional(&self.db)
        .await?;

        Ok(user)
    }

    pub async fn find_by_id(&self, id: Uuid) -> AppResult<Option<User>> {
        let user = sqlx::query_as::<_, User>(
            "SELECT id, name, email, password_hash, role, created_at, updated_at FROM users WHERE id = $1"
        )
        .bind(id)
        .fetch_optional(&self.db)
        .await?;

        Ok(user)
    }

    pub async fn count(&self) -> AppResult<i64> {
        let count: i64 = sqlx::query_scalar("SELECT COUNT(*) FROM users")
            .fetch_one(&self.db)
            .await?;
        Ok(count)
    }

    pub async fn list_with_scan_counts(&self, limit: i64, offset: i64) -> AppResult<Vec<(User, i64)>> {
        #[derive(sqlx::FromRow)]
        struct UserWithCount {
            id: Uuid,
            name: String,
            email: String,
            password_hash: String,
            role: String,
            created_at: DateTime<Utc>,
            updated_at: DateTime<Utc>,
            scan_count: Option<i64>,
        }

        let rows = sqlx::query_as::<_, UserWithCount>(
            r#"
            SELECT u.id, u.name, u.email, u.password_hash, u.role, u.created_at, u.updated_at,
                   COUNT(s.id) as scan_count
            FROM users u
            LEFT JOIN scans s ON s.user_id = u.id
            GROUP BY u.id
            ORDER BY u.created_at DESC
            LIMIT $1 OFFSET $2
            "#
        )
        .bind(limit)
        .bind(offset)
        .fetch_all(&self.db)
        .await?;

        let result = rows
            .into_iter()
            .map(|r| {
                (
                    User {
                        id: r.id,
                        name: r.name,
                        email: r.email,
                        password_hash: r.password_hash,
                        role: r.role,
                        created_at: r.created_at,
                        updated_at: r.updated_at,
                    },
                    r.scan_count.unwrap_or(0),
                )
            })
            .collect();

        Ok(result)
    }

    pub async fn store_refresh_token(
        &self,
        user_id: Uuid,
        token_hash: &str,
        expires_at: DateTime<Utc>,
    ) -> AppResult<()> {
        sqlx::query(
            r#"
            INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
            VALUES ($1, $2, $3)
            "#
        )
        .bind(user_id)
        .bind(token_hash)
        .bind(expires_at)
        .execute(&self.db)
        .await?;

        Ok(())
    }

    pub async fn find_refresh_token(&self, token_hash: &str) -> AppResult<Option<(Uuid, DateTime<Utc>, Option<DateTime<Utc>>)>> {
        #[derive(sqlx::FromRow)]
        struct TokenRow {
            user_id: Uuid,
            expires_at: DateTime<Utc>,
            revoked_at: Option<DateTime<Utc>>,
        }

        let row = sqlx::query_as::<_, TokenRow>(
            r#"
            SELECT user_id, expires_at, revoked_at
            FROM refresh_tokens
            WHERE token_hash = $1
            "#
        )
        .bind(token_hash)
        .fetch_optional(&self.db)
        .await?;

        Ok(row.map(|r| (r.user_id, r.expires_at, r.revoked_at)))
    }

    pub async fn revoke_refresh_token(&self, token_hash: &str) -> AppResult<()> {
        sqlx::query(
            "UPDATE refresh_tokens SET revoked_at = NOW() WHERE token_hash = $1"
        )
        .bind(token_hash)
        .execute(&self.db)
        .await?;

        Ok(())
    }

    pub async fn revoke_all_user_tokens(&self, user_id: Uuid) -> AppResult<()> {
        sqlx::query(
            "UPDATE refresh_tokens SET revoked_at = NOW() WHERE user_id = $1 AND revoked_at IS NULL"
        )
        .bind(user_id)
        .execute(&self.db)
        .await?;

        Ok(())
    }
}
