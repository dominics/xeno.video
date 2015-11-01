FROM phusion/passenger-nodejs

# Add application user
RUN groupadd -r app-tv && useradd -r -d /app -g app-tv app-tv

# Cache NPM dependencies by doing them first
ADD package.json /tmp/package.json
RUN cd /tmp && npm install --loglevel verbose
RUN cp -a /tmp/node_modules /app

ENV PATH $PATH:/app/node_modules/.bin
USER app-tv

COPY . /app
WORKDIR /app

EXPOSE 3000
ENV PORT=3000

CMD ["node", "bin/www"]
