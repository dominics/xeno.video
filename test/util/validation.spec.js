import * as validation from './../../dist/util/validation';

describe('util module validation', () => {
  describe('export itemsForChannel', () => {
    const sut = validation.itemsForChannel.params.channel;

    const valid = {
      normalString: 'videos',
    };

    const invalid = {
      emptyString: '',
    };

    Object.keys(invalid).forEach((testcase) => {
      it('rejects invalid parameter: ' + testcase, (done) => {
        sut.validate(invalid[testcase], (err, value) => {
          expect(err).to.be.instanceof(Error);
          expect(value).to.be.empty;
          done();
        });
      });
    });

    Object.keys(valid).forEach((testcase) => {
      it('accepts valid parameter: ' + testcase, (done) => {
        sut.validate(valid[testcase], done);
      });
    });
  });
});
