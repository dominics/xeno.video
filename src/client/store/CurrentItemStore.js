import { ReduceStore } from 'flux/utils';

export default class CurrentItemStore extends ReduceStore
{
  getInitialState() {
    return null;
  }

  reduce(state, action) {
    switch (action.type) {
      case 'select-item':
        return action.id;
      default:
        return state;
    }
  }
}
