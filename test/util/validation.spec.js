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

  describe('export session()', () => {
    it('is a validation method', () => {
      expect(validation.session).to.be.a('function');
    });

    it('validates a request is authenticated', () => {
      const mock = {
        isAuthenticated: sinon.stub().returns(true),
        session: {
          passport: {
            user: {
              accessToken: 'fooAccessToken',
              refreshToken: 'fooRefreshToken',
              authenticated: (Date.now() / 1000) - 10,
            },
          },
        },
      };

      expect(validation.session(mock)).to.be.eql('pass');
    });
  });
});
