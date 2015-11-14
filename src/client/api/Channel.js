import Api from './Api';
import { default as registry, pending, receiveChannels } from '../action';
import libdebug from 'debug';

const debug = libdebug('xeno:api:channel');

export default class Channel extends Api
{
  refresh() {
    return this.get(
      '/channel/all',
      registry.get(pending),
      registry.get(receiveChannels)
    );
  }

  //something() {
  //  this.getAll().then(
  //    (channels) => {
  //      debug('Setting data.channels to', channels);
  //      this.setState(React.addons.update(this.state, {data: {channels: {$set: channels}}}));
  //      this.onChannelSelect(channels[0], { state: 'initial mount, set as default channel' });
  //    },
  //    (err) => {
  //      debug(err);
  //    }
  //  );
  //}
}
