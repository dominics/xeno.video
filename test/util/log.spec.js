import log from './../../dist/util/log';
import _outfile from './outfile';

const outfile = _outfile.bind(undefined, 'log');

describe('module log', () => {
  describe('class Log', () => {
    it('can be instantiated, for whatever good that does', () => {
      expect(new log.Log()).to.be.an.instanceof(log.Log);
    });

    describe('static methods', () => {
      describe('.setLevel(level)', () => {
        it('can be used to set the log level', () => {
          log.Log.setLevel(log.Log.error);
          expect(log.Log.level).to.be.eql(log.Log.error);
          log.Log.setLevel(log.Log.debug);
          expect(log.Log.level).to.be.eql(log.Log.debug);
        });
      });

      describe('.setFile(path)', () => {
        it('can accept multiple paths in a row', () => {
          log.Log.setFile(outfile('initial'));
          log.Log.log('Some message');
          log.Log.setFile(outfile('second'));
          log.Log.log('Some message');
        });
      });
    });
  });

  describe('exports convenient short logger forms', () => {
    const tests = [
      log.error,
      log.warning,
      log.notice,
      log.info,
      log.debug,
    ];

    log.Log.setFile(outfile('short-form'));

    tests.forEach((test) => {
      describe('function ' + test.name, () => {
        it('is a logger helper function', () => {
          test('Some log message', {some: 'context'});
        });
      });
    });
  });
});


