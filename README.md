# Prompt-Eng

## ScamShield — Full-Stack Cybersecurity & Fraud Detection Platform

ScamShield is an explainable fraud detection web application that identifies potentially fraudulent SMS messages, WhatsApp messages, suspicious URLs, phishing attempts, and digital communication scams.

### Architecture & Tech Stack

- **Backend**: Rust (Axum, Tokio, SQLx, Argon2id, JWT, Utoipa, Regex, URL crate)
- **Database**: PostgreSQL 16 with SQLx migrations
- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React, Recharts, TanStack Query, React Hook Form, Zod
- **Infrastructure**: Docker, Docker Compose

### Quick Start

1. Start with Docker Compose:
   ```bash
   cd scamshield
   docker-compose up --build
   ```

2. Or run manually:
   - Backend:
     ```bash
     cd scamshield/backend
     cargo run
     ```
   - Frontend:
     ```bash
     cd scamshield/frontend
     npm install
     npm run dev
     ```

Frontend runs at `http://localhost:5173` and backend API at `http://localhost:8080/api/v1`.

