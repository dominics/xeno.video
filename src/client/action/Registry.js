import libdebug from 'debug';
import Action from './Action';

const debug = libdebug('xeno:action:registry');

export default class ActionRegistry {
  /**
   * @type {Object.<string,function(string):?string>}
   */
  creators = {};

  /**
   * @type {Dispatcher}
   */
  dispatcher = null;

  /**
   * @param {Dispatcher} dispatcher
   * @param {Array.<string>} types
   */
  constructor(dispatcher, types) {
    this.dispatcher = dispatcher;

    types.forEach(type => {
      this.creators[type] = this._creator(type);
    });
  }

  /**
   * @returns {Array.<string>}
   */
  get types() {
    return Object.keys(this.creators);
  }

  /**
   * @param {string} type
   * @returns {function(Object): string}
   */
  getCreator(type) {
    return this.creators[type];
  }

  /**
   * @param {string} type
   * @param {function(Object): string} creator
   */
  setCreator(type, creator) {
    this.creators[type] = creator;
  }

  getHandler(type) {
    return (event) => {
      this.creators[type](null, event);
    }
  }

  /**
   * @param {string} type
   * @param {function({?function(*, Object): string}): function(*, Object): string} fn
   */
  wrap(type, fn) {
    this.setCreator(type, fn.bind(undefined, this.getCreator(type) || null));
  }

  /**
   * @param {Action} action
   * @return {string}
   * @private
   */
  _dispatch(action) {
    debug('Dispatching action', action);
    return this.dispatcher.dispatch(action);
  }

  /**
   * @param {string} type
   * @returns {function(*, Object):string|null}
   */
  _creator(type) {
    return (err = null, data = null) => {
      debug('Creating action', type, err, data);
      const action = new Action(type, err, data);

      debug('Action is', action);
      return this._dispatch(action);
    };
  }
}
