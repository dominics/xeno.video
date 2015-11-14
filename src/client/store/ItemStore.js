import { MapStore } from 'flux/utils';

export default class ItemStore extends MapStore {

  //
  //something() {
  //  this.props.stores.item.getAllForChannel(channel).then(
  //    (items) => {
  //      this.setState(React.addons.update(this.state, {data: {items: {$set: items}}}));
  //      debug('Initial load, setting as default item', items[0]);
  //      this.onItemSelect(items[0], { state: 'initial channel load, set as default item' });
  //    },
  //    (err) => {
  //      debug('Error', err);
  //    }
  //  );
  //}

  reduce(state, action) {
    switch (action.type) {
      default:
        return state;
    }
  }
}
