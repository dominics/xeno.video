import { MapStore } from 'flux/utils';
import libdebug from 'debug';
import { receiveItemsForChannel } from '../action';

const debug = libdebug('xeno:store:item');

export default class ItemStore extends MapStore {
  reduce(state, action) {
    switch (action.type) {
      case receiveItemsForChannel:
        if (action.isError()) {
          debug('Item store received error');
          return state;
        }

        debug('Item store received data, mutating', action.data);
        return state.withMutations(map => {
          let mutated = map;

          for (const item of action.data.items) {
            mutated = mutated.set(item.id, item);
          }
        });
      default:
        return state;
    }
  }
}
