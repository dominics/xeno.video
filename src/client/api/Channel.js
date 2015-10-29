import Api from './Api';
import { default as registry, pending, receiveChannels } from '../action';
import libdebug from 'debug';

const debug = libdebug('xeno:api:channel');

export default class Channel extends Api
{
  refresh() {
    return this.get(
      '/channel/all',
      registry.getCreator(pending),
      registry.getCreator(receiveChannels)
    );
  }
}
