# Multi-stage Docker build optimized for production & HuggingFace Spaces
FROM node:22-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production=false

# Build the app
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image - supports both local (3000) and HF Spaces (7860)
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
# HF Spaces default port is 7860; local default is 3000
ENV PORT=${PORT:-7860}
ENV HOST=0.0.0.0

RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 appuser
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public

# Install Playwright + Chromium for screenshot/GIF recording (optional)
# RUN npm install -g playwright && npx playwright install chromium

EXPOSE ${PORT}
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:'+process.env.PORT+'/api/health', (r) => { process.exit(r.statusCode === 200 ? 0 : 1) })"
USER appuser
CMD ["node", "dist/server.cjs"]
