FROM node:latest
WORKDIR /usr/src/app

RUN apt update
RUN apt install -y uchardet zip

COPY package.json package-lock.json .
RUN npm ci

COPY . .
ENV NODE_ENV production
RUN npm run build
EXPOSE 8192
CMD npm start
