import { ReduceStore } from 'flux/utils';

export default class CurrentChannelStore extends ReduceStore
{
  getInitialState() {
    return null;
  }

  reduce(state, action) {
    switch (action.type) {
      default:
        return state;
    }
  }
}
