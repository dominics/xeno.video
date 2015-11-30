//import { ReduceStore } from 'flux/utils';
//import libdebug from 'debug';
//
//const debug = libdebug('xeno:store:basicReduceStore');
//
//export default class BasicReduceStore extends ReduceStore {
//  /**
//   * @type {Object.<string, function(K, object): K>}
//   */
//  reducers = {};
//
//  constructor(dispatcher) {
//    super(dispatcher);
//
//    this.reducers = this.getReducers();
//  }
//
//  /**
//   * Returns a map from an action type to a reducer function
//   *
//   * Reducers functions don't need to deal with error actions, and assume they've
//   * been taken care of. They also deal with action.data directly, rather than the
//   * whole action.
//   *
//   * They receive the current state, and action data. They should return the new
//   * state to adopt (which can just be the old one).
//   *
//   * To use a reducer that just sets the state to action.data, you can pass boolean
//   * true instead of a reducer function.
//   *
//   * @return {Object.<string, function(K, object): K>}
//   */
//  getReducers() {
//    return {};
//  }
//
//  reduce(state, action) {
//    if (action.isError()) {
//      debug('Store received error', this.constructor.name, action.err);
//      return state;
//    }
//
//    if (typeof this.reducers[action.type] === 'function') {
//      debug('Store received data, using reduction', this.constructor.name, action.data);
//      return this.reducers[action.type](state, action.data);
//    } else if (typeof this.reducers[action.type] === 'boolean' && this.reducers[action.type]) {
//      debug('Store received data, using value as state', this.constructor.name, action.data);
//      return action.data;
//    }
//
//    return state;
//  }
//}
