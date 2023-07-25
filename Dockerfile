# Setup node
FROM node:alpine as base
WORKDIR /app

# Setup packageManager
FROM base as pnpm
RUN corepack enable

# Install deps only when needed
FROM pnpm AS deps
COPY package.json pnpm-lock.yaml .npmrc ./
RUN pnpm install --no-frozen-lockfile

# Rebuild source code
FROM pnpm AS builder
COPY . ./
COPY --from=deps /app/node_modules ./node_modules
RUN npx prisma generate && pnpm build

# Setup packageManager
FROM base as runner
ENV NUXT_DATABASE_URL="file:/app/data/navlens.db"
COPY --from=builder /app/.output /app/.output
COPY --from=builder /app/package.json /app/package.json
COPY --from=builder /app/prisma /app/prisma
EXPOSE 3000
VOLUME ["/app/data"]
CMD ["npm", "run", "docker:start"]
