FROM node:16

RUN mkdir -p /usr/src/app

# Cache NPM dependencies by doing them first
ADD package.json /tmp/package.json
RUN cd /tmp && npm install
RUN cp -a /tmp/node_modules /usr/src/app/

ENV PATH $PATH:/usr/src/app/node_modules/.bin

COPY . /usr/src/app
WORKDIR /usr/src/app

EXPOSE 3000
ENV PORT=3000

CMD ["node", "index.js"]
