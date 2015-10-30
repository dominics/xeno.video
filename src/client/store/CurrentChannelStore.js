import { channelSelect, channelSelected } from './../action';
import libdebug from 'debug';
import { MapStore } from 'flux/utils';
import { Map } from 'immutable';

const debug = libdebug('xeno:store:currentChannel');

export default class CurrentChannelStore extends MapStore
{
  state = Map({
    pending: null,
    selected: null,
  });

  hasChannel() {
    return !!this._state.get('selected', null);
  }

  reduce(state, action) {
    switch (action.type) {
      case channelSelect:
        return state.set('pending', action.data);
      case channelSelected:
        return state.set('pending', null).set('channelId', action.data.channelId);
      default:
        return state;
    }
  }
}
