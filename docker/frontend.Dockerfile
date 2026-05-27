# ==========================================
# STAGE 1: BUILD THE APPLICATION
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

# Build production Next.js assets
RUN npm run build

# Install only production dependencies
RUN npm prune --production

# ==========================================
# STAGE 2: RUN THE APPLICATION
# ==========================================
FROM node:20-alpine AS runner

WORKDIR /usr/src/app

ENV NODE_ENV=production
ENV PORT=3000

# Copy Next.js configurations and built distribution files
COPY --from=builder /usr/src/app/public ./public
COPY --from=builder /usr/src/app/.next ./.next
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package*.json ./

EXPOSE 3000

# Start server using Next.js runtime
CMD ["npm", "start"]
