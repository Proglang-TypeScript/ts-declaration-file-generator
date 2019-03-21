FROM node:10-alpine AS builder

WORKDIR /usr/local/app
COPY . .

RUN apk update && \
	apk add git

RUN npm install npm@latest -g
RUN npm install -g typescript
RUN npm install
RUN npm run build

# -------------------------------------------------

FROM node:10-alpine

RUN apk update

WORKDIR /usr/local/app

COPY --from=builder /usr/local/app/node_modules ./node_modules
COPY --from=builder /usr/local/app/dist ./dist

RUN mkdir output

ENTRYPOINT [ "node", "./dist/index.js" ]