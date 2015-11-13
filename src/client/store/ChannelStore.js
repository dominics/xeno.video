import { MapStore } from 'flux/utils';

export default class ChannelStore extends MapStore {
  getAll() {
    return this._multi('/channel/all');
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
