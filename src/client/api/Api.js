import libdebug from 'debug';

const debug = libdebug('xeno:api');

export default class Api {
  /**
   * @param {string} url
   * @param {function(object): string} pending  Action creator
   * @param {function(object): string} complete Action creator
   * @returns Promise which, when resolved, provides a dispatcher token for the complete action
   */
  get(url, pending, complete) {
    debug('Dispatching pending action with data', url);
    pending(url);

    return $.getJSON(url)
      .then(
        (data) => {
          debug('Dispatching complete action with data', data);
          return Promise.resolve(complete(data.data));
        },
        (xhr, status, error) => {
          throw new Error(xhr, status, error);
        }
      );
  }
}
