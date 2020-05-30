FROM node:lts-alpine AS builder

WORKDIR /usr/local/app
RUN apk update

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build
RUN npm prune --production

# -------------------------------------------------

FROM node:lts-alpine

RUN apk update

WORKDIR /usr/local/app

COPY --from=builder /usr/local/app/node_modules ./node_modules
COPY --from=builder /usr/local/app/dist ./dist

RUN mkdir output

ENTRYPOINT [ "node", "./dist/index.js" ]