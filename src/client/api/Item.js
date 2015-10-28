import Api from './Api';
import libdebug from 'debug';

const debug = libdebug('xeno:api:item');

export default class Item extends Api
{
  getAllForChannel(channel) {
    const url = `/item/channel/${channel.props.id}`;
    return this.get(url);
  }
}
