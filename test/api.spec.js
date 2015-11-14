import path from 'path';

describe('API functional tests', function tests() {
  before(() => {
    require('node-env-file')(path.join(__dirname, './../test/fixture/functional-env'));
    [this.app] = require('./../dist/app')();
    this.request = request(this.app);
  });

  describe('GET /channel/all', () => {
    it('Returns a list of channels', (done) => {
      this.request.get('/channel/all')
        .expect(200, done);
    });
  });

  describe('GET /setting/all', () => {
    it('Returns a list of settings', (done) => {
      this.request.get('/setting/all')
        .expect(200, done);
    });
  });

  describe('GET /item/channel/videos', () => {
    it('Returns a list of items', (done) => {
      this.request.get('/item/channel/videos')
        .expect(200, done);
    });
  });
});
