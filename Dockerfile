FROM node:latest
WORKDIR /usr/src/app

RUN apt install uchardet

COPY package.json .
RUN npm install
COPY . .
EXPOSE 8192
CMD ["node", "index.js"]
