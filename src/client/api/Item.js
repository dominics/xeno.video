import Api from './Api';
import libdebug from 'debug';

const debug = libdebug('xeno:api:item');

export default class Item extends Api
{
  /**
   * @param channelId
   * @returns {Promise.<Array>}
   */
  getAllForChannel(channelId) {
    debug('Getting all items for channel', channelId);
    return this.filterId(this.getJSON(`/item/channel/${channelId}`));
  }
}
