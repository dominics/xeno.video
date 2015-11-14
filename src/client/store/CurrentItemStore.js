import { ReduceStore } from 'flux/utils';
import actions from './../actions';

export default class CurrentItemStore extends ReduceStore
{
  getInitialState() {
    return null;
  }

  reduce(state, action) {
    switch (action.type) {
      case actions.selectItem:
        return action.id;
      default:
        return state;
    }
  }
}
