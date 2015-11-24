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

    Object.keys(types).forEach(type => {
      this.creators[types[type]] = this._creator(types[type]);
    });
  }

  /**
   * @param {string} type
   * @returns {function(*, Object): string|null}
   */
  addType(type) {
    if (typeof this.creators[type] !== 'undefined') {
      throw new Error('Type is already defined');
    }

    return (this.creators[type] = this._creator(type));
  }

  /**
   * @returns {Array.<string>}
   */
  get types() {
    return Object.keys(this.creators);
  }

  /**
   * @param {string} type
   * @param {Array.<function(Object): Object>} transformers
   * @returns {function(*, Object): string}
   */
  getCreator(type, ...transformers) {
    this._validateType(type);
    const base = this.creators[type];

    if (transformers.length === 0) {
      return base;
    }

    return (err = null, data = null) => {
      if (err !== null) {
        return base(err, data);
      }

      let transformed = data;

      for (const transformer of transformers) {
        transformed = transformer(transformed);
      }

      return base(err, transformed);
    };
  }

  /**
   * @param {string} type
   * @param {function(Object): string} creator
   */
  setCreator(type, creator) {
    this.creators[type] = creator;
  }

  /**
   * Use like:
   *   registry.getHandler('foo').bind(undefined, {
   *    'foo' => 'bar'
   *   });
   * to send data
   *
   * @param {string} type
   * @param {boolean} preventDefault
   * @returns {function(*, Event): string}
   */
  getHandler(type, preventDefault = true) {
    this._validateType(type);

    // The actual event handler that will be called
    return (data, event) => {
      debug(`Handling event as ${type}`, event, data);
      this.getCreator(type)(null, data);

      if (preventDefault) {
        event.preventDefault();
        event.stopPropagation();
        return false;
      }
    };
  }

  /**
   * @param {string} type
   * @param {function({?function(*, Object): string}): function(*, Object): string} fn
   */
  wrap(type, fn) {
    this._validateType(type);
    this.setCreator(type, fn.bind(undefined, this.getCreator(type) || null));
  }

  _validateType(type) {
    if (typeof this.creators[type] === 'undefined') {
      throw new Error('Unknown action type: ' + type);
    }
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
