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

  something() {
    this.props.stores.item.getAllForChannel(channel).then(
      (items) => {
        this.setState(React.addons.update(this.state, {data: {items: {$set: items}}}));
        debug('Initial load, setting as default item', items[0]);
        this.onItemSelect(items[0], { state: 'initial channel load, set as default item' });
      },
      (err) => {
        debug('Error', err);
      }
    );
  }

  getAllForChannel(channel) {
    const url = `/item/channel/${channel.props.id}`;
    return this._multi(url);
  }
}
