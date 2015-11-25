import deps from './../../dist/deps';
import {outfile} from './../log';

describe('functional test: index routes', function tests() {
  before(() => {
    this.container = deps().container;

    const config = this.container.config;
    config.LOG_FILE = outfile(['functional', 'index']);

    this.app = this.container.stack;
    this.request = request(this.app);
  });

  describe('GET /', () => {
    it('loads the app frame', (done) => {
      this.request.get('/')
        .expect(200, done);
    });
  });

  after(() => {
    (this.container.shutdown)();
  });
});
