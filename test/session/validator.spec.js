import validator from './../../dist/session/validator';

describe('session module validator', () => {
  it('is a constructor function', () => {
    expect(validator).to.be.a('function');
  });

  it('validates a request is authenticated', () => {
    const mockRequest = {
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

    const refresh = sinon.stub.returns(Promise.resolve('foo'));
    const authRequired = true;

    expect(validator().validate(refresh, authRequired, mockRequest)).to.eventually.eql('pass');
  });
});
