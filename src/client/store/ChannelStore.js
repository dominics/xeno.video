import { MapStore } from 'flux/utils';
import libdebug from 'debug';

const debug = libdebug('xeno:store:channel');

export default class ChannelStore extends MapStore {
  getAll() {
    return this._multi('/channel/all');
  }

  something() {
    this.getAll().then(
      (channels) => {
        debug('Setting data.channels to', channels);
        this.setState(React.addons.update(this.state, {data: {channels: {$set: channels}}}));
        this.onChannelSelect(channels[0], { state: 'initial mount, set as default channel' });
      },
      (err) => {
        debug(err);
      }
    );
  }

  _multi(url) {
    return new Promise((resolve, reject) => {
      $.getJSON(url).then(
        (data) => resolve(data.channel),
        (xhr, status, err) => reject(xhr, status, err)
      );
    });
  }
}
