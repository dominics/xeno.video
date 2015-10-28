import { MapStore } from 'flux/utils';
import libdebug from 'debug';
import { viewStart, viewEnd } from './../action';

const debug = libdebug('xeno:store:viewedItem');

export default class ViewedItemStore extends MapStore {
  reduce(state, action) {
    switch (action.type) {
      case viewStart:
        debug('Received view start in viewed item store');
        return state;
      case viewEnd:
        debug('Received view end in viewed item store');
        return state;
      default:
        return state;
    }
  }
}
