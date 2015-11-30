import ItemStore from './../../dist/item/ItemStore';
import {default as storeTest, queue} from './../reddit/Store';

describe('store (item) concrete', () => {
  let sut = null;

  before(() => {
    const api = null;
    const redis = null;
    const validator = null;
    const queues = {
      itemByChannel: queue(),
      channelsForUser: queue(),
    };

    sut = new ItemStore(api, redis, validator, queues);
  });

  it('is a store', () => storeTest(sut));
});
