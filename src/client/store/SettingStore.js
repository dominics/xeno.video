import { MapStore } from 'flux/utils';
import libdebug from 'debug';
import types from '../action/types';

const debug = libdebug('xeno:store:setting');

export default class SettingStore extends MapStore {
  reduce(state, action) {
    switch (action.type) {
      case types.settingReceive:
        if (action.isError()) {
          debug('Setting store received error on setting receive action');
          return state;
        }

        debug('Setting received data, mutating', action.data);
        return state.withMutations(map => {
          let mutated = map;

          for (const setting of action.data) {
            mutated = mutated.set(setting.id, setting.value);
          }
        });
      case types.settingUpdate:
        if (action.isError()) {
          debug('Setting store received error on setting update action');
          return state;
        }

        debug('Setting was updated, mutating', action.data);
        return state.set(action.data.id, action.data.state);
      default:
        return state;
    }
  }
}
