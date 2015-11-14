import { ReduceStore } from 'flux/utils';
import { default as _actions, selectChannel } from './../action';
import libdebug from 'debug';

const debug = libdebug('xeno:store:currentChannel');

export default class CurrentChannelStore extends ReduceStore
{
  getInitialState() {
    return null;
  }

  reduce(state, action) {
    switch (action.type) {
      case selectChannel:
        return action.data;
      default:
        return state;
    }
  }
}
