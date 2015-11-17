import deps from './../../dist/deps';

describe('functional test: user routes', function tests() {
  before(() => {
    this.app = deps.container.stack;
    this.request = request(this.app);
  });

  describe('GET /login', () => {
    it('sends you off to reddit', (done) => {
      this.request.get('/login')
        .expect(302, done);
    });
  });
});
