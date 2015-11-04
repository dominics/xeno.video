import types from '../action/types';
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
      case types.channelSelect:
        if (action.isError()) {
          debug('Error selecting channel', action.err);
          return state.set('pending', null).set('selected', null);
        }

        return state.set('pending', action.data);
      case types.channelSelected:
        if (action.isError()) {
          debug('Error on channel selected', action.err);
          return state.set('pending', null).set('selected', null);
        }

        return state.set('pending', null).set('selected', action.data.channelId);
      default:
        return state;
    }
  }
}
