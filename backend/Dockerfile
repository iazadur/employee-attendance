FROM node:22-alpine AS deps

WORKDIR /app

RUN apk add --no-cache openssl

COPY package.json package-lock.json ./
RUN npm ci


FROM node:22-alpine AS build

WORKDIR /app

RUN apk add --no-cache openssl

COPY --from=deps /app/node_modules ./node_modules
COPY package.json package-lock.json ./
COPY prisma ./prisma
COPY prisma.config.ts ./
COPY tsconfig.json tsconfig.build.json nest-cli.json ./
COPY src ./src

RUN npx prisma generate
RUN npm run build


FROM node:22-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

RUN apk add --no-cache openssl

# Copy built app and node_modules from deps, then prune dev deps
COPY --from=deps /app/node_modules ./node_modules
COPY package.json package-lock.json ./
RUN npm prune --omit=dev

COPY --from=build /app/prisma ./prisma
COPY --from=build /app/dist ./dist

EXPOSE 3001

# Run migrations then start API (no auto seed inside image)
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]

