import { MapStore } from 'flux/utils';
import Promise from 'bluebird';
import libdebug from 'debug';

const debug = libdebug('xeno:store:setting');

export default class SettingStore extends MapStore {
  _old() {
    this.props.stores.setting.getAll().then(settings => {
      this.setState(React.addons.update(this.state, {data: {settings: {$set: settings}}}));
    });

    return Promise.resolve({
      nsfw: true,
      ratio: 'free',
    });
  }

  reduce(state, action) {
    switch (action.type) {
      default:
        return state;
    }
  }
}
