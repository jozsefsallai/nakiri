FROM node:14-alpine AS deps
RUN apk add --no-cache libc6-compat

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

FROM node:14-alpine AS builder

WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules

RUN yarn build

FROM node:14-alpine AS nodejs

WORKDIR /app

RUN addgroup -g 1001 -S ayame
RUN adduser -S ayame -u 1001

# probably needs some refactoring
COPY --from=builder --chown=ayame:ayame /app .

USER ayame

RUN sh ./bin/makedocs.sh
