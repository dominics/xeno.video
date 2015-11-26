import deps from './../../dist/deps';
import {outfile} from './../log';

describe('functional test: user routes', function tests() {
  before(() => {
    this.container = deps().container;

    const config = this.container.config;
    config.LOG_FILE = outfile(['functional', 'user']);

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
