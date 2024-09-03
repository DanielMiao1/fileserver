FROM node:22-alpine
WORKDIR /usr/src/app

RUN apk update
RUN apk add uchardet zip

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
ENV NODE_ENV production
RUN npm run build
EXPOSE 8192
CMD npm start
