import deps from './../../dist/deps';

describe('functional test: index routes', function tests() {
  before(() => {
    this.app = deps.container.stack;
    this.request = request(this.app);
  });

  describe('GET /', () => {
    it('loads the app frame', (done) => {
      this.request.get('/')
        .expect(200, done);
    });
  });

  after(() => {
    (deps.container.shutdown)();
  });
});
