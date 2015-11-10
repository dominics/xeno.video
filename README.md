# xeno.video

Visit [https://xeno.video/](https://xeno.video/) to see it in action.

## Configuration

You can configure xeno.video with environment variables. Some are required.

All of the variables are documented in the the file `env.dist`.  Similar config
files are read from `.env` and  `/etc/xeno/env`; copy `env.dist` to one of
those locations and modify it in place.  Actual environment variables will
override whatever is in the config on disk.

## Installing

* npm install
* Run `gulp build`
* Run `./bin/www`
* Visit, by default, http://127.0.0.1:3000/

### Or, via Docker

* docker build .

### Or, via Wercker

* wercker build
