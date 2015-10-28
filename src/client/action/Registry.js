import libdebug from 'debug';

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
   * @param {Array.<Symbol.<String>>} types
   */
  constructor(dispatcher, types) {
    this.dispatcher = dispatcher;

    types.forEach(type => {
      this.creators[type] = this._creator(type);
    });
  }

  /**
   * @returns {Array.<Symbol.<String>>}
   */
  get types() {
    return Object.keys(this.creators);
  }

  /**
   * @param {Symbol.<String>} type
   * @returns {function(Object): string}
   */
  get(type) {
    return this.creators[type];
  }

  /**
   * @param {Symbol.<String>} type
   * @param {function(Object): string} creator
   */
  set(type, creator) {
    this.creators[type] = creator;
  }

  /**
   * @param {Symbol.<String>} type
   * @param {function({?function(Object): string}): function(Object): string} fn
   */
  wrap(type, fn) {
    this.creators[type] = fn.bind(undefined, this.creators[type] || null);
  }

  /**
   * @param {Symbol.<String>} type
   * @param {object} data
   * @returns {{type: Symbol.<String>, data: Object, created: number}}
   */
  _payload(type, data) {
    return {
      type: type.valueOf(),
      data: data,
      created: Date.now() / 1000,
    };
  }

  /**
   * @param {Object} action
   * @return {string}
   * @private
   */
  _dispatch(action) {
    debug('Dispatching action', action);
    return this.dispatcher.dispatch(action);
  }

  /**
   * @param {string} type
   * @returns {function(Object):string|null}
   */
  _creator(type) {
    return (data) => {
      debug('Creating action', type, data);
      return this._dispatch(this._payload(type, data));
    };
  }
}
