# ── Build Stage ──────────────────────────────────────────────────────────────
FROM rust:1-slim AS builder

WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y \
    pkg-config \
    libssl-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy manifests first to cache dependencies
COPY Cargo.toml Cargo.lock* ./
# Create dummy source files to cache dependencies
RUN mkdir src && echo 'fn main() {}' > src/main.rs && touch src/lib.rs
RUN cargo build --release 2>/dev/null || true
RUN rm -rf src

# Copy real source
COPY . .
RUN touch src/main.rs src/lib.rs

# Build release binary
RUN cargo build --release

# ── Runtime Stage ─────────────────────────────────────────────────────────────
FROM debian:bookworm-slim AS runtime

WORKDIR /app

# Install runtime dependencies
RUN apt-get update && apt-get install -y \
    ca-certificates \
    libssl3 \
    && rm -rf /var/lib/apt/lists/*

# Copy the binary
COPY --from=builder /app/target/release/scamshield-backend /app/scamshield-backend
# Copy migrations
COPY --from=builder /app/migrations /app/migrations

# Create a non-root user
RUN useradd -r -s /bin/false scamshield
USER scamshield

EXPOSE 8080

CMD ["/app/scamshield-backend"]

