# ── Build Stage ──────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies first (leverage layer cache)
COPY package*.json ./
RUN npm ci

# Copy source code and build production bundle
COPY . .
RUN npm run build

# ── Production Stage ──────────────────────────────────────────────────────────
FROM nginx:alpine AS runner

# Copy built assets to Nginx html directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration for SPA routing on port 5173
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 5173

CMD ["nginx", "-g", "daemon off;"]
