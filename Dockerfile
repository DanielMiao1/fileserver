FROM node:latest
WORKDIR /usr/src/app

RUN apt update
RUN apt install -y uchardet zip

COPY package.json package-lock.json .
RUN npm ci

COPY . .
RUN npm run build
EXPOSE 8192
ENV NODE_ENV production
CMD npm start
