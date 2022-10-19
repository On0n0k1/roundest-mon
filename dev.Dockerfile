FROM node:18

WORKDIR /app

# Install dependencies based on the preferred package manager
COPY ./package.json ./package-lock.json* ./

# ENV NODE_ENV production
# Uncomment the following line in case you want to disable telemetry during runtime.
ENV NEXT_TELEMETRY_DISABLED 1

RUN npm i

COPY .env ./.env
# COPY prisma ./prisma
# COPY src ./src
# COPY public ./public
# COPY next.config.js .
# COPY tsconfig.json .

COPY . .

EXPOSE 3000

# Using this command during build time will not work
# because network is not available during build
# RUN npx prisma migrate dev --name init


CMD npx prisma migrate deploy && npm run dev