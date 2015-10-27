import { ReduceStore } from 'flux/utils';

export default class CurrentChannelStore extends ReduceStore
{
  getInitialState() {
    return null;
  }

  reduce(state, action) {
    switch (action.type) {
      case 'select-channel':
        return action.id;
      default:
        return state;
    }
  }
}
