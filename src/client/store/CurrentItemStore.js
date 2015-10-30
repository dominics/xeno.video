import libdebug from 'debug';
import BasicReduceStore from './BasicReduceStore';
import { itemSelect, channelSelected } from '../action';
import _ from 'lodash';
const debug = libdebug('xeno:store:currentItem');

export default class CurrentItemStore extends BasicReduceStore
{
  getInitialState() {
    return null;
  }

  getReducers() {
    const reducers = super.getReducers();

    reducers[itemSelect] = true;
    reducers[channelSelected] = (state, data) => {
      if (state === null) {
        return state;
      }

      const id = _.get(data, 'items[0].id');
      return (id !== null) ? id : state;
    };

    return reducers;
  }
}
