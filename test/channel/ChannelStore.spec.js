import ChannelStore from './../../dist/channel/ChannelStore';
import {default as storeTest, queue} from './../reddit/Store';

describe('store (channel) concrete', () => {
  let sut = null;

  before(() => {
    const api = null;
    const redis = null;
    const validator = null;
    const queues = {
      itemByChannel: queue(),
      channelsForUser: queue(),
    };
    const sessionStore = null;

    sut = new ChannelStore(api, redis, validator, queues, sessionStore);
  });

  it('is a store', () => storeTest(sut));
});
