FROM node:alpine3.21 AS builder

WORKDIR /app

COPY ./package* /app/

RUN npm install

COPY . /app/
RUN npm run build

FROM node:alpine3.21 as deploy

WORKDIR /app

COPY ./package* /app/

RUN npm install --omit=dev
COPY --from=builder /app/dist/ /app/dist/

ENTRYPOINT ["npm", "run", "start"]
