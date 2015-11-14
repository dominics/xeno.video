import { ReduceStore } from 'flux/utils';
import { default as actions, selectItem } from './../action';

export default class CurrentItemStore extends ReduceStore
{
  getInitialState() {
    return null;
  }

  reduce(state, action) {
    switch (action.type) {
      case selectItem:
        return action.data.id;
      default:
        return state;
    }
  }
}
