import Store from './../util/Store';

export default class ItemStore extends Store {
  constructor(request) {
    super(request);

    this.name = 'item';
  }
}
