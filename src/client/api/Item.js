import Api from './Api';
import libdebug from 'debug';
import { default as registry, pending, receiveItemsForChannel } from '../action';

const debug = libdebug('xeno:api:item');

export default class Item extends Api
{
  getAllForChannel(channelId) {
    return this.get(
      `/item/channel/${channelId}`,
      registry.get(pending),
      registry.get(receiveItemsForChannel)
    );
  }
}
