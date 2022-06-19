import ItemStore from './../../src/item/ItemStore';
import {default as storeTest, queue} from './../reddit/Store';

describe('store (item) concrete', function () {
  this.sut = null;

  beforeAll(() => {
    const api = null;
    const redis = null;
    const validator = null;
    const queues = {
      itemByChannel: queue(),
      channelsForUser: queue(),
    };

    this.sut = new ItemStore(api, redis, validator, queues);
  });

  describe('abstract', () => {
    it('is a store', () => storeTest(this.sut));
  });
});
