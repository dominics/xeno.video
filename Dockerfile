FROM node:4.2

COPY . /usr/src/app
WORKDIR /usr/src/app

RUN npm install
RUN npm build

EXPOSE 3000
ENV PORT=3000

CMD ["node", "bin/www"]
