import libdebug from 'debug';
import _ from 'lodash';

const debug = libdebug('xeno:api');

export default class Api {
  /**
   * @param {string} url
   * @returns Promise which, when resolved/rejected, provides the response data, or an error
   */
  get(url) {
    return new Promise((resolve, reject) => {
      $.getJSON(url)
        .then(
          (data) => {
            resolve(data.data);
          },
          (xhr, status, error) => {
            reject(new Error(error));
          }
        );
    });
  }

  patch(url, data) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: url,
        data: JSON.stringify(data),
        type: 'PATCH',
        dataType: 'json',
        contentType: 'application/json',
        success: (response) => {
          resolve(response);
        },
        error: (xhr, status, err) => {
          reject(new Error(err));
        },
      });
    });
  }

  filterId(dataPromise) {
    return dataPromise.then(data => {
      if (!Array.isArray(data)) {
        return Promise.resolve(data);
      }
      return Promise.resolve(data.filter(item => _.has(item, 'id')));
    });
  }
}
