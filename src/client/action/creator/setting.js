import types from './../types';
import libdebug from 'debug';

const debug = libdebug('xeno:actions:setting');

export default (registry, api, store) => {
  function _receive(requestPromise) {
    return requestPromise
      .then((data) => {
        debug('Got setting data from API', data);
        return registry.getCreator(types.settingReceive)(null, data);
      })
      .catch((e) => {
        debug('Got error receiving settings from API', e);
        return registry.getCreator(types.settingReceive)(e);
      });
  }

  /**
   * On initialize action, start API requests
   *
   * @param previous
   * @param err
   * @param _data
   * @returns {*}
   */
  function initialize(previous, err = null, _data = null) {
    if (err) {
      return previous(err);
    }

    _receive(api.setting.refresh());

    debug('Beginning setting initialization');
    return previous(err, _data);
  }

  /**
   * @param previous
   * @param err
   * @param settings
   * @returns {*}
   */
  function settingUpdate(previous, err = null, settings = []) {
    if (err) {
      return previous(err);
    }

    debug('Beginning setting update');
    _receive(api.setting.update(settings));

    return previous(err, settings);
  }

  registry.wrap(types.initialize, initialize);
  registry.wrap(types.settingUpdate, settingUpdate);
};

