import deps from './../../dist/deps';
import {outfile} from './../log';

describe('functional test: API routes', function tests() {
  before(() => {
    const config = deps.container.config;
    config.LOG_FILE = outfile(['functional']);

    this.app = deps.container.stack;
    this.request = request(this.app);
  });

  describe('GET /api/channel/all', () => {
    it('Returns a list of channels', (done) => {
      this.request
        .get('/api/channel/all')
        .expect('Content-Type', /application\/json/)
        .expect(200, done);
    });
  });

  describe('GET /api/setting/all', () => {
    it('Returns a list of settings', (done) => {
      this.request
        .get('/api/setting/all')
        .expect('Content-Type', /application\/json/)
        .expect(200, done);
    });
  });

  describe('PATCH /api/setting', () => {
    it('Updates settings and then returns them', (done) => {
      const payload = {
        type: 'setting',
        data: [
          {
            id: 'nsfw',
            value: true,
          },
        ],
      };

      this.request
        .patch('/api/setting')
        .send(payload)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(function(res) {
          expect(res.body).to.be.an('object');
          expect(res.body.type).to.be.eql('setting');
        })
        .expect(200, done);
    });
  });

  describe('GET /api/item/channel/videos', () => {
    it('Returns a list of items', (done) => {
      this.request
        .get('/api/item/channel/videos')
        .expect('Content-Type', /application\/json/)
        .expect(200, done);
    });
  });

  after(() => {
    deps.container.redis.unref();
  });
});
