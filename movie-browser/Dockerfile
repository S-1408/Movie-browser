# syntax=docker/dockerfile:1
# docker filehave the instruction to build the Docker image 
# ----step 1- deps: install node_modules from the lockfile ----
    # create Node.js env
    # copies package files
    # run npm ci
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ----step 2- builder: build the Next.js app ----

FROM node:22-alpine AS builder
WORKDIR /app
#Copies dependencies from deps.
COPY --from=deps /app/node_modules ./node_modules  
#Copies source code.
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
# Pages are prerendered at build time and call TMDB, so the token is needed here.
# .env.local is mounted as a build secret so it never ends up in an image layer.
#Injects TMDB build secret. and run npm run build
RUN --mount=type=secret,id=env,target=/app/.env.local npm run build

# ----step 3- runner: minimal production image ----
    #Run production application
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

# Create non-root user
RUN addgroup -S nodejs -g 1001 && adduser -S nextjs -u 1001 -G nodejs
# Copy public folder
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
# Copy standalone output/build
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
# Copy static assets
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
# Starts server.js.
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
