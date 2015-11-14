import { ReduceStore } from 'flux/utils';
import { default as _actions, selectItem } from './../action';
import libdebug from 'debug';

const debug = libdebug('xeno:store:currentItem');

export default class CurrentItemStore extends ReduceStore
{
  getInitialState() {
    return null;
  }

  reduce(state, action) {
    switch (action.type) {
      case selectItem:
        debug('Current item store received selectItem action', action);
        return action.data.id;
      default:
        return state;
    }
  }
}
