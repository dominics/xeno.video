import { MapStore } from 'flux/utils';
import libdebug from 'debug';
import { settingReceiveAll } from '../action';

const debug = libdebug('xeno:store:setting');

export default class SettingStore extends MapStore {
  reduce(state, action) {
    switch (action.type) {
      case settingReceiveAll:
        if (action.isError()) {
          debug('Setting store received error updating');
          return state;
        }

        debug('Setting received data, mutating', action.data);
        return state.withMutations(map => {
          let mutated = map;

          for (const setting of action.data) {
            mutated = mutated.set(setting.id, setting.value);
          }
        });
      default:
        return state;
    }
  }
}
