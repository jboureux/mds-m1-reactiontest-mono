FROM node:lts-alpine

WORKDIR /api

COPY ../api/ .

RUN npm install

EXPOSE 1234

ENTRYPOINT npm run dev
