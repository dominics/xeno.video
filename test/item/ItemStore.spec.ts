import ItemStore from './../../dist/item/ItemStore';
import {default as storeTest, queue} from './../reddit/Store';

describe('store (item) concrete', function () {
  this.sut = null;

  before(() => {
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
