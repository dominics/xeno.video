import libdebug from 'debug';
import { ReduceStore } from 'flux/utils';
import { itemSelect, channelSelected } from '../action';
import _ from 'lodash';
const debug = libdebug('xeno:store:currentItem');

export default class CurrentItemStore extends ReduceStore
{
  getInitialState() {
    return null;
  }

  reduce(state, action) {
    switch (action.type) {
      case itemSelect:
        return action.isError() ? null : action.data;
      case channelSelected:
        if (state !== null) {
          return state;
        }

        return _.get(action.data, 'items[0].id', null);
      default:
        return state;
    }
  }
}
