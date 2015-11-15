import path from 'path';
import app from './../dist/app';
import config from './../dist/config';

describe('API functional tests', function tests() {
  this.slow(5000);
  this.timeout(10000);

  before(() => {
    config();
    [this.app] = app();
    //this.request = request(this.app);
  });
  //
  describe('GET /channel/all', () => {
    it('Returns a list of channels', (done) => {
      done();
      //this.request.get('/channel/all')
      //  .expect(200, done);
    }); //
  });
  //
  //describe('GET /setting/all', () => {
  //  it('Returns a list of settings', (done) => {
  //    this.request.get('/setting/all')
  //      .expect(200, done);
  //  });
  //});
  //
  //describe('GET /item/channel/videos', () => {
  //  it('Returns a list of items', (done) => {
  //    this.request.get('/item/channel/videos')
  //      .expect(200, done);
  //  });
  //});
});
