FROM node:lts-alpine

WORKDIR /api

COPY ../api/ .

EXPOSE 1234

ENTRYPOINT npm install && npm run dev
