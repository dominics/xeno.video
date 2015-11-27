import validator from './../../dist/session/validator';

describe('session module validator', () => {
  it('is a constructor function', () => {
    expect(validator).to.be.a('function');
  });

  it('validates a request is authenticated', () => {
    const goodRequest = {
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

    const badRequest = {
      isAuthenticated: sinon.stub().returns(true),
      session: {
        passport: {
          user: {
            accessToken: 'fooAccessToken',
            refreshToken: 'fooRefreshToken',
            authenticated: (Date.now() / 1000) - (100 * 60 * 60),
          },
        },
      },
    };

    const refresh = sinon.stub.returns(Promise.resolve('foo'));
    const authRequired = true;

    expect(validator(refresh).validate(authRequired, goodRequest)).to.eventually.be.resolved;
    expect(validator(refresh).validate(authRequired, badRequest)).to.eventually.be.rejected;
  });
});
