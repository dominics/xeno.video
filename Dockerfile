FROM phusion/passenger-nodejs

# Add application user
RUN groupadd -r app-tv && useradd -r -d /app -g app-tv app-tv

# Cache NPM dependencies by doing them first
ADD package.json /tmp/package.json
RUN cd /tmp && npm install
RUN cp -a /tmp/node_modules /app

# Cache Bower dependencies by doing them first
ADD bower.json /tmp/bower.json
RUN cd /tmp && /app/node_modules/.bin/bower install
RUN cp -a /tmp/bower_components /app

COPY . /app
WORKDIR /app


ENV PATH $PATH:/app/node_modules/.bin
USER app-tv

RUN npm build

EXPOSE 3000
ENV PORT=3000

CMD ["node", "bin/www"]
