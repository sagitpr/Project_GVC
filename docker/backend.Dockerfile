# ==========================================
# STAGE 1: BUILD THE APPLICATION
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Copy dependency configuration files
COPY package*.json ./
COPY prisma ./prisma/

# Install full dependencies including devDependencies
RUN npm ci

# Copy application source code
COPY . .

# Generate Prisma Client and compile TypeScript source code
RUN npx prisma generate
RUN npm run build

# Install only production dependencies to save weight
RUN npm prune --production

# ==========================================
# STAGE 2: RUN THE APPLICATION
# ==========================================
FROM node:20-alpine AS runner

WORKDIR /usr/src/app

# Set container environment flags
ENV NODE_ENV=production
ENV PORT=5000

# Copy compiled source code and production node_modules from builder
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/prisma ./prisma

EXPOSE 5000

# Start server using standard Node run
CMD ["node", "dist/main"]
