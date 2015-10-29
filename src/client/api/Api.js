import libdebug from 'debug';

const debug = libdebug('xeno:api');

export default class Api {
  /**
   * @param {string} url

   * @returns Promise which, when resolved/rejected, provides the response data, or an error
   */
  getJSON(url) {
    return new Promise((resolve, reject) => {
      $.getJSON(url)
        .then(
          (data) => {
            resolve(data.data);
          },
          (xhr, status, error) => {
            reject(error);
          }
        );
    });
  }

  /**
   *
   * @param url
   * @param {function(object): string} pending  Action creator
   * @param {function(object): string} complete Action creator
   * @returns {*}
   */
  get(url, pending, complete) {
    debug('API request pending', url);
    const token = pending(null, url);

    this.getJSON(url)
      .then(data => {
        debug('API request success', data);
        complete(null, data);
      })
      .catch(err => {
        debug('API request error', err);
        complete(err, null);
      });

    return token;
  }
}
