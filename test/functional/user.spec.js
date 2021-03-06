import deps from './../../dist/deps';
import config from './../../dist/config';

describe('functional test: user routes', function tests() {
  before(() => {
    this.container = deps(config()).container;
    this.container.config.LOG_FILE = outfile(['functional', 'index']);

    this.app = this.container.stack;
    this.request = request(this.app);
  });

  describe('GET /login', () => {
    it('sends you off to reddit', (done) => {
      this.request
        .get('/login')
        .expect(302, done);
    });
  });

  after(() => {
    (this.container.shutdown)();
  });
});
