FROM node:latest
WORKDIR /usr/src/app

RUN apt update
RUN apt install -y uchardet

COPY package.json .
RUN npm ci
COPY . .
EXPOSE 8192
ENV NODE_ENV production
CMD npm start
