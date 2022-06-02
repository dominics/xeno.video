import Api from './../../dist/reddit/Api';

describe('class reddit.Api', function () {
  this.api = null;

  before(() => {
    this.api = new Api();
  });

  describe('.subreddit(sub, sort)', () => {
    it('is a function', () => {
      expect(this.api.subreddit).to.be.a('function');
    });
  });

  describe('.multis()', () => {
    it('is a function', () => {
      expect(this.api.multis).to.be.a('function');
    });
  });

  describe('.subscribed()', () => {
    it('is a function', () => {
      expect(this.api.subscribed).to.be.a('function');
    });
  });
});
