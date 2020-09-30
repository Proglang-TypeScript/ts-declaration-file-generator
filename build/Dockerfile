FROM node:lts-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./
ENV NODE_ENV=development
RUN npm ci

COPY . .
RUN npm run build

# -------------------------------------------------

FROM node:lts-alpine

WORKDIR /usr/src/app
RUN chown node:node -R /usr/src/app
USER node

ENV NODE_ENV=production

COPY package*.json ./
COPY --from=builder /usr/src/app/dist ./dist

RUN npm ci

RUN mkdir output

ENTRYPOINT [ "node", "./dist/index.js" ]