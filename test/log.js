import config from './../config';
import path from 'path';
import debug from 'debug';

export function outfile(ident = [], extension = '.log') {
  const identifier = (Array.isArray(ident) && ident.length > 1) ? ident.join('-') : 'xeno';
  return path.join(config.build.output, `${identifier}-${(new Date()).getTime()}${extension}`);
}

export let log = null;

export function logTo(ident = []) {
  const file = outfile(ident);

  if (log && log !== process.stderr) {
    log.end();
  }

  log = fs.createWriteStream(file, {flags: 'a'});

  debug.log = (message) => {
    log.write(message);
  };
}
