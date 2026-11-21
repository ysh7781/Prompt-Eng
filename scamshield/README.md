# ScamLens 🔍

A full-stack cybersecurity web application that uses rule-based detection to identify phishing messages and malicious URLs.

## Overview

ScamLens allows users to submit suspicious SMS messages or URLs for analysis. The backend applies a layered detection engine — keyword matching, URL analysis, and structural heuristics — to compute a risk score and surface actionable findings.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Rust, Axum 0.7, SQLx 0.7 |
| Database | PostgreSQL 16 |
| Auth | JWT (access + refresh tokens), Argon2id password hashing |
| Frontend | React + TypeScript + Vite (separate worker) |
| Infrastructure | Docker, Docker Compose |

## Quick Start (Docker Compose)

```bash
# Clone the repo
git clone <repo-url>
cd scamshield

# Start all services
docker compose up --build

# API available at http://localhost:8080/api/v1
# Frontend available at http://localhost:5173
```

## Manual Development Setup

### Prerequisites

- Rust 1.75+
- PostgreSQL 16
- Node.js 20+ (for frontend)

### Backend

```bash
cd backend

# Copy and configure environment
cp .env.example .env
# Edit .env with your database credentials and JWT secret

# Run migrations & start server
cargo run
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | — | PostgreSQL connection string |
| `JWT_SECRET` | — | Secret key for JWT signing (min 32 chars) |
| `JWT_ACCESS_TOKEN_EXPIRY` | `900` | Access token expiry in seconds (15 min) |
| `JWT_REFRESH_TOKEN_EXPIRY` | `604800` | Refresh token expiry in seconds (7 days) |
| `FRONTEND_ORIGIN` | `http://localhost:5173` | CORS allowed origin |
| `HOST` | `0.0.0.0` | Server bind host |
| `PORT` | `8080` | Server port |
| `RUST_LOG` | `info` | Tracing log level |

## API Endpoints

### Auth

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/v1/auth/register` | Public | Register a new user |
| POST | `/api/v1/auth/login` | Public | Login and get tokens |
| POST | `/api/v1/auth/refresh` | Public | Refresh access token |
| GET | `/api/v1/auth/me` | Bearer | Get current user info |
| POST | `/api/v1/auth/logout` | Bearer | Revoke all refresh tokens |

### Scanner

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/v1/scanner/analyze` | Bearer | Analyze a message or URL |

### History

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/v1/history?page=1&page_size=20` | Bearer | Get user scan history |

### Dashboard

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/v1/dashboard` | Bearer | Get user dashboard stats |

### Admin

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/v1/admin/dashboard` | Admin Bearer | Admin dashboard |
| GET | `/api/v1/admin/rules` | Admin Bearer | List detection rules |
| PATCH | `/api/v1/admin/rules/:id` | Admin Bearer | Enable/disable a rule |

## Running Tests

```bash
cd backend
cargo test
```

## Architecture

```
backend/src/
├── config.rs          # Environment-based configuration
├── state.rs           # Shared app state (DB pool, config)
├── error.rs           # Unified AppError with HTTP mapping
├── models/            # SQLx database models
├── dto/               # Request/response DTOs with validation
├── utils/             # JWT + Argon2 password utilities
├── middleware/        # Axum auth middleware (JWT extraction)
├── repositories/      # SQLx query layer (no business logic)
├── detection/         # Rule-based detection engine
│   ├── keyword_rules  # Regex-based message keyword detection
│   ├── url_rules      # URL structure analysis
│   ├── message_rules  # URL extraction from text
│   ├── scoring        # Risk scoring & classification
│   └── analyzer       # Orchestrates all detection modules
├── services/          # Business logic layer
├── handlers/          # Axum request handlers (thin)
└── routes/            # Route registrations
```

### Risk Levels

| Score | Level |
|-------|-------|
| 0–24 | 🟢 Low |
| 25–49 | 🟡 Moderate |
| 50–74 | 🟠 High |
| 75–100 | 🔴 Critical |

## Security

- Passwords hashed with Argon2id
- JWT with configurable expiry
- Refresh token rotation on use
- Parameterized SQL queries only
- CORS restricted to configured frontend origin
- Request body size limited to 1 MB

