import fs from 'fs';

export class Log {
  static levels = {
    error: 0,
    warning: 1,
    notice: 2,
    info: 3,
    debug: 4,
  };

  static level = 1;
  static out = process.stderr;
  static file = null;

  static setLevel(level) {
    Log.level = level;
  }

  static setFile(file) {
    if (Log.out && Log.out !== process.stderr) {
      Log.out.end();
    }

    Log.out = fs.createWriteStream(file, {flags: 'a'});
  }

  static label(level) {
    return Object.keys(Log.levels)[level];
  }

  static log(message, level = 2, context = null) {
    if (level > Log.level) {
      return;
    }

    Log._doLog(message, level, context);
  }

  static _doLog(message, level, context) {
    const levelString = Log.label(level);
    const contextString = context ? '(' + JSON.stringify(context) + ')' : '';
    Log._write(`[${levelString}] ${message} ${contextString}\n`);
  }

  static _write(string) {
    Log.out.write(string);
  }
}

export const error = (message, context) => Log.log(message, Log.levels.error, context);
export const warning = (message, context) => Log.log(message, Log.levels.warning, context);
export const notice = (message, context) => Log.log(message, Log.levels.notice, context);
export const info = (message, context) => Log.log(message, Log.levels.info, context);
export const debug = (message, context) => Log.log(message, Log.levels.debug, context);

export default {
  log: Log.log,
  Log: Log,

  error: error,
  warning: warning,
  notice: notice,
  info: info,
  debug: debug,
};
