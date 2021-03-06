import ChannelStore from './../../dist/channel/ChannelStore';
import {default as storeTest, queue} from './../reddit/Store';

describe('store (channel) concrete', function() {
  this.sut = null;

  before(() => {
    const api = null;
    const redis = null;
    const validator = {
      validate: sinon.stub().returns(Promise.resolve('ok')),
    };
    const queues = {
      itemByChannel: queue(),
      channelsForUser: queue(),
    };
    const sessionStore = null;

    this.sut = new ChannelStore(api, redis, validator, queues, sessionStore);
  });

  describe('abstract', () => {
    it('is a store', () => storeTest(this.sut));
  });

  describe('.getAll(req, res)', () => {
    it('Promises an array', () => {
      const req = {
        session: {
          channelsRefreshed: Math.floor(Date.now() / 1000),
          passport: {
            user: {
              accessToken: 'blah',
            },
          },
        },
      };
      const res = null; //

      const result = this.sut.getAll(req, res);
      return expect(result).to.eventually.be.an('object').then((subscriptions) => {
        expect(subscriptions).to.haveOwnProperty('multis')
          .and.haveOwnProperty('subscribed');

        expect(subscriptions.multis).to.be.an.instanceof(Array);
        expect(subscriptions.subscribed).to.be.an.instanceof(Array);
      });
    });
  });
});
