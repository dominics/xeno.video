import deps from './../../dist/deps';
import config from './../../dist/config';

describe('functional test: API routes', function tests() {
  before(() => {
    this.container = deps(config()).container;
    this.container.config.LOG_FILE = outfile(['functional', 'api']);

    this.app = this.container.stack;
    this.request = request(this.app);
  });

  describe('GET /api/channel/all', () => {
    it('Returns a list of channels', (done) => {
      this.request
        .get('/api/channel/all')
        .expect('Content-Type', /application\/json/)
        .expect(function(res) {
          expect(res.body).to.be.an('object');
          expect(res.body.type).to.be.eql('channel');
          expect(res.body.data).to.be.a('object');
          expect(res.body.data.subscribed).to.be.an.instanceof(Array);
          expect(res.body.data.multis).to.be.an.instanceof(Array);
          expect(res.body.data.defaults).to.be.an.instanceof(Array);
        })
        .expect(200, done);
    });
  });

  describe('GET /api/setting/all', () => {
    it('Returns a list of settings', (done) => {
      this.request
        .get('/api/setting/all')
        .expect('Content-Type', /application\/json/)
        .expect(function(res) {
          expect(res.body).to.be.an('object');
          expect(res.body.type).to.be.eql('setting');
          expect(res.body.data).to.be.instanceOf(Array);
        })
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
          expect(res.body.data).to.deep.include.members([{ id: 'nsfw', value: true }]);
        })
        .expect(200, done);
    });
  });

  describe('GET /api/item/channel/videos', () => {
    it('Returns a list of items', (done) => {
      this.request
        .get('/api/item/channel/videos')
        .expect('Content-Type', /application\/json/)
        .expect(function(res) {
          expect(res.body).to.be.an('object');
          expect(res.body.type).to.be.eql('item');
          expect(res.body.data).to.be.instanceOf(Array);
        })
        .expect(200, done);
    });
  });

  after(() => {
    (this.container.shutdown)();
  });
});
