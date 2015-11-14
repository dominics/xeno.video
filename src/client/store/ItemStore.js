import { MapStore } from 'flux/utils';
import libdebug from 'debug';
import { receiveItemsForChannel } from '../action';

const debug = libdebug('xeno:store:item');

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
      case receiveItemsForChannel:
        debug('Received items for channel, mutating state', action, state);
        return state;
      default:
        return state;
    }
  }
}
