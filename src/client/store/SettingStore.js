import { MapStore } from "flux/utils";
import libdebug from "debug";
import { Map } from "immutable";
import types from "../action/types";
import Setting from "../setting/Setting";

const debug = libdebug("xeno:store:setting");

export default class SettingStore extends MapStore {
  getInitialState() {
    return Map({
      authenticated: new Setting("authenticated", false),
      name: new Setting("name", null),
      userId: new Setting("userId", null),
      nsfw: new Setting("nsfw", false),
      autoplay: new Setting("autoplay", true),
    });
  }

  reduce(state, action) {
    switch (action.type) {
      case types.settingReceive:
        return this._receive(state, action);
      case types.settingUpdate:
        return this._update(state, action);
      default:
        return state;
    }
  }

  /*
   * action.data is an array of confirmed setting objects, {{ id: string, value: mixed }}
   */
  _receive(state, action) {
    if (action.isError()) {
      debug("Setting store received error on setting receive action");
      return state;
    }

    return this._merge(
      state,
      action.data.map((setting) => setting.setConfirmed())
    );
  }

  /*
   * action.data is an array of pending setting objects, {{ id: string, value: mixed }}
   */
  _update(state, action) {
    if (action.isError()) {
      debug("Setting store received error on setting update action");
      return state;
    }

    return this._merge(
      state,
      action.data.map((setting) => setting.setPending())
    );
  }

  _merge(state, settings) {
    debug("Merging settings into state", settings);

    return state.withMutations((map) => {
      let mutated = map;

      for (const setting of settings) {
        mutated = mutated.set(setting.id, setting);
      }
    });
  }
}
