import { MapStore } from 'flux/utils';
import libdebug from 'debug';
import { typeMap } from './../actions';

const debug = libdebug('xeno:store:viewedItem');

export default class ViewedItemStore extends MapStore {
  reduce(state, action) {
    switch (action.type) {
      case typeMap.viewStart:
        debug('Received view start in viewed item store');
        return state;
      case typeMap.viewEnd:
        debug('Received view end in viewed item store');
        return state;
      default:
        return state;
    }
  }
}
