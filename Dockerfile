FROM node:20-alpine

WORKDIR /app

COPY package.json .

RUN yarn install --slient

RUN yarn add global nodemon

COPY ./src .

EXPOSE 4000

CMD ["yarn",  "dev"]