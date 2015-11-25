import types from './../types';
import libdebug from 'debug';

const debug = libdebug('xeno:actions:setting');

export default (registry, api, store) => {
  /**
   * On initialize action, start API requests
   *
   * @param previous
   * @param err
   * @param originalData
   * @returns {*}
   */
  function initialize(previous, err = null, originalData = null) {
    if (err) {
      return previous(err);
    }

    debug('Beginning setting initialization');

    const settingReceiveToken = api.setting
      .refresh()
      .then((data) => {
        debug('Got setting data from API', data);
        return registry.getCreator(types.settingReceive)(null, data);
      })
      .catch((e) => {
        debug('Got error receiving settings from API', e);
        return registry.getCreator(types.settingReceive)(e);
      });

    return previous(err, [originalData, settingReceiveToken]);
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
  }

  registry.wrap(types.initialize, initialize);
  registry.wrap(types.settingUpdate, settingUpdate);
};

