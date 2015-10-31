import { default as React, Component } from 'react/addons';
import ItemList from './ItemList';
import Viewer from './Viewer';
import NavBar from './NavBar';
import { Container as FluxContainer } from 'flux/utils';
import libdebug from 'debug';
import stores from './../store';
import { registry, initialize } from '../action';
const debug = libdebug('xeno:container');

class ContainerComponent extends Component {
  componentDidMount() {
    debug('Initializing the app');
    registry.getCreator(initialize)(null, {
      status: 'starting up the app!',
    });
  }

  static getStores() {
    const arr = Object.keys(stores).map(name => stores[name]);
    debug('Container has stores', arr);

    return arr;
  }

  static calculateState(_prevState) {
    const state = {};

    Object.keys(stores).forEach(key => {
      state[key] = stores[key].getState();
    });

    return state;
  }

  render() {
    const state = this.state;
    const item = state.item;
    const itemByChannel = state.itemByChannel;
    const channel = state.channel;
    const currentItemId = state.currentItem;

    const currentChannelId = state.currentChannel.get(
      'selected',
      state.currentChannel.get('pending', null)
    );

    const currentItem = currentItemId
      ? item.get(currentItemId, null)
      : null;

    const currentChannel = currentChannelId
      ? channel.get(currentChannelId, null)
      : null;

    const currentChannelItems = currentChannelId
      ? itemByChannel.get(currentChannelId, []).map(itemId => item.get(itemId)).filter(v => !!v)
      : null;

    debug('Rendering using state', state);

    return (
      <section className="container-fluid">
        <NavBar
          setting={state.setting}
          channel={channel}
          currentChannel={currentChannel} />

        <div className="row">
          <Viewer
            setting={state.setting}
            currentItem={currentItem}
            socket={state.socket} />

          <ItemList
            currentChannelItems={currentChannelItems}
            viewedItem={state.viewedItem}
            currentItemId={currentItemId} />
        </div>
      </section>
    );
  }

}

const container = FluxContainer.create(ContainerComponent);
export default container;
