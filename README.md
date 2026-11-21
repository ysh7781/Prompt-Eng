# ScamShield — Explainable Cybersecurity & Threat Intelligence Platform

[![Backend CI](https://img.shields.io/badge/Rust-1.75+-black?style=flat&logo=rust)](https://www.rust-lang.org/)
[![Axum](https://img.shields.io/badge/Axum-0.7-orange?style=flat)](https://github.com/tokio-rs/axum)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue?style=flat&logo=postgresql)](https://www.postgresql.org/)
[![Frontend](https://img.shields.io/badge/React-18.3-61dafb?style=flat&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

**ScamShield** is a production-grade cybersecurity platform engineered to identify and neutralize fraudulent SMS messages, WhatsApp notices, phishing URLs, and credential harvesting schemes. Unlike black-box scanners that return vague ratings, ScamShield evaluates every submission against a deterministic, multi-tier heuristic detection engine with fully explainable risk factors.

---

## 📸 Modern Light SaaS User Interface

The interface is inspired by high-productivity security platforms, utilizing an ambient light-blue surface (`#F4F8FD`), pure white cards (`#FFFFFF`), subtle borders (`#E8EFF6`), and dark navy typography (`#172B4D`):

- **Interactive Dashboard**: Metric overview cards (Total Scans, High-Risk Alerts, Clean Scans, Active Trends), Risk Distribution telemetry chart, and recent scan audit logs.
- **Message Security Scanner**: Centered scanning card with instant character counter, audit logging switch, and rule-based explanations.
- **URL Security Inspector**: Zero-execution link inspection (safe sandboxing that never accesses malicious endpoints directly).
- **Scan History**: Filterable, searchable audit table with full forensic report modal and report export.
- **Detection Engine Administration**: Administrative console to tune heuristic weights, toggle live rules, and monitor telemetry.

---

## 🏛️ Application Architecture

```mermaid
flowchart TD
    Client["React 18 SPA (Vite + Tailwind CSS)"]
    Router["Axum HTTP Router & CORS Middleware"]
    Auth["JWT & Argon2id Authentication Guard"]
    Scanner["Scanner Handler & DTO Validation"]
    Engine["Detection Engine (15+ Deterministic Heuristics)"]
    Service["Scanner & Analytics Service Layer"]
    Repo["SQLx Repositories"]
    DB[("PostgreSQL 16 Database")]

    Client -->|HTTPS REST Request| Router
    Router --> Auth
    Auth --> Scanner
    Scanner --> Engine
    Engine --> Service
    Service --> Repo
    Repo --> DB
```

### Separation of Concerns:
`HTTP Request` → `Router` → `Handler` → `Service` → `Detection Engine / Repository` → `PostgreSQL` → `HTTP Response`

---

## 🔍 Heuristic Detection Engine

The detection engine evaluates multi-tier risk indicators in sub-millisecond execution time:

| Category | Rule Code | Description | Default Weight |
|---|---|---|---|
| **Urgency** | `MSG_URGENCY_01` | Threatening language (suspension within 24h, legal action, fines) | +25 pts |
| **Credentials** | `MSG_CRED_01` | Solicits passwords, OTPs, PINs, card verification codes | +40 pts |
| **Financial Scam** | `MSG_FIN_01` | Lottery claims, unexpected prize winnings, crypto doubling | +30 pts |
| **Impersonation** | `MSG_IMPERSONATE_01` | Contextually matches financial / banking names with urgency | +30 pts |
| **Domain Anomaly** | `URL_SUSP_TLD` | Abuse-prone free TLDs (`.tk`, `.ml`, `.xyz`, `.top`, `.click`, `.buzz`) | +20 pts |
| **Homograph Attack**| `URL_PUNYCODE` | Punycode (`xn--`) or internationalized domain spoofing | +35 pts |
| **Insecure Transport**| `URL_HTTP_ONLY`| Plain HTTP protocol without SSL/TLS certificates | +10 pts |
| **Host Masking** | `URL_IP_HOST` | Raw IPv4/IPv6 address instead of legitimate registered domain | +25 pts |
| **URL Shorteners** | `URL_SHORTENER` | Obfuscated redirection targets (`bit.ly`, `tinyurl.com`, `t.co`) | +15 pts |

*Scores are mathematically aggregated and capped at 100. Overlapping duplicate rules are deduplicated.*

---

## 🚀 Quick Start Guide

### Option 1: Docker Compose (All-in-One)

```bash
# Clone the repository
git clone https://github.com/ysh7781/Prompt-Eng.git
cd Prompt-Eng/scamshield

# Launch PostgreSQL, Backend, and Frontend containers
docker-compose up --build
```
- Frontend UI: `http://localhost:5173`
- Backend API: `http://localhost:8080/api/v1`
- PostgreSQL: `localhost:5432`

---

### Option 2: Local Development

#### Prerequisites
- Rust stable (1.75+)
- Node.js 18+ & npm
- PostgreSQL 15+

#### 1. Setup Database
```bash
# Set your DATABASE_URL in scamshield/backend/.env
DATABASE_URL="postgresql://scamshield:scamshield@127.0.0.1:5432/scamshield"
```

#### 2. Run Rust Backend
```bash
cd scamshield/backend
cargo run
```
*Migrations and default detection rules are applied automatically on startup.*

#### 3. Run React Frontend
```bash
cd scamshield/frontend
npm install
npm run dev
```

---

## 🧪 Automated Testing

### Backend Unit & Integration Tests (37 Tests)
```bash
cd scamshield/backend
cargo test
```
- Heuristic pattern evaluation tests
- URL homograph & IP extraction tests
- Score capping and rule deduplication
- Argon2id password hashing tests
- JWT creation, validation, and tampering checks
- Axum authorization & admin middleware integration tests

### Frontend Unit & Component Tests (14 Tests)
```bash
cd scamshield/frontend
npm run test
```
- RiskBadge rendering for all severity tiers
- ScanResult explainability card checks
- MessageScanner input validation and character counting
- Authentication and registration form validation

---

## 🛡️ Security Features

- **Argon2id Hashing**: High memory/time cost configuration preventing brute-force dictionary attacks.
- **Stateless JWTs + Hashed Refresh Tokens**: Secure token rotation with SHA-256 stored refresh hashes.
- **Zero-Execution URL Inspection**: ScamShield analyzes link structures without initiating HTTP socket connections to malicious targets, protecting users and servers from drive-by payloads.
- **Privacy Assurance**: Sensitive credentials (passwords, OTPs) are never indexed or logged in plain text.
- **Strict Role-Based Access Control (RBAC)**: Fine-grained middleware authorization separates standard users from detection rule engine administrators.

---

## 📄 License
This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
