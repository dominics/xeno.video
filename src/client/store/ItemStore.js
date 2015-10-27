import { MapStore } from 'flux/utils';

export default class ItemStore extends MapStore {
  _multi(url) {
    return new Promise((resolve, reject) => {
      $.getJSON(url).then(
        (data) => resolve(data.item),
        (xhr, status, err) => reject(xhr, status, err)
      );
    });
  }

  getAllForChannel(channel) {
    const url = `/item/channel/${channel.props.id}`;
    return this._multi(url);
  }
}
