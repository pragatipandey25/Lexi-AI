# ==========================================
# LexiAI — Production Multi-Stage Dockerfile
# Architect & Owner: Pragati Pandey
# ==========================================

# Stage 1: Build Frontend Client
FROM node:22-alpine AS client-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci --silent
COPY client/ ./
RUN npm run build

# Stage 2: Production Server
FROM node:22-alpine AS production
WORKDIR /app

# Install system dependencies for native modules and OCR fonts
RUN apk add --no-cache tesseract-ocr tesseract-ocr-data-eng

ENV NODE_ENV=production
ENV PORT=5000

# Copy server dependencies and install production-only packages
COPY server/package*.json ./server/
WORKDIR /app/server
RUN npm ci --only=production --silent

# Copy server source code
COPY server/ ./

# Copy built frontend assets from stage 1 into client/dist
WORKDIR /app
COPY --from=client-builder /app/client/dist ./client/dist

# Ensure uploads directory has write permissions
RUN mkdir -p /app/server/uploads && chown -R node:node /app

USER node
WORKDIR /app/server

EXPOSE 5000

CMD ["node", "src/server.js"]
