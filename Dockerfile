FROM node:4.2

RUN mkdir -p /usr/src/app

# Cache NPM dependencies by doing them first
ADD package.json /tmp/package.json
RUN cd /tmp && npm install
RUN cp -a /tmp/node_modules /usr/src/app/

ENV PATH $PATH:/usr/src/app/node_modules/.bin

# Cache Bower dependencies too
ADD bower.json /tmp/bower.json
ADD .bowerrc /tmp/.bowerrc
RUN cd /tmp && /usr/src/app/node_modules/.bin/bower install --allow-root
RUN cp -a /tmp/bower_components /usr/src/app/

COPY . /usr/src/app
WORKDIR /usr/src/app

EXPOSE 3000
ENV PORT=3000

CMD ["node", "index.js"]
