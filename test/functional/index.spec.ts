import deps from './../../src/deps';
import config from './../../src/config';

describe('functional test: index routes', function tests() {
  beforeAll(() => {
    this.container = deps(config()).container;
    this.container.config.LOG_FILE = outfile(['functional', 'index']);

    this.app = this.container.stack;
    this.request = request(this.app);
  });

  describe('GET /', () => {
    it('loads the app frame', (done) => {
      this.request.get('/')
        .expect(200, done);
    });
  });

  afterAll(() => {
    (this.container.shutdown)();
  });
});
