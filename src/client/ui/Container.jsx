import { default as React, Component } from 'react/addons';
import ItemList from './ItemList';
import Viewer from './Viewer';
import NavBar from './NavBar';
import { Container as FluxContainer } from 'flux/utils';
import libdebug from 'debug';
import stores from './../store';
import { default as actions, initialize } from '../action';
const debug = libdebug('xeno:container');

class ContainerComponent extends Component {
  componentDidMount() {
    debug('Initializing the app');
    actions.getCreator(initialize)(null, {
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
    const channel = state.channel;

    const currentItemId = state.currentItem;
    const currentChannelId = state.currentChannel;

    const currentItem = currentItemId ? item.get(currentItemId) : null;
    const currentChannel = currentChannelId ? channel.get(currentChannelId) : null;

    return (
      <div id="container">
        <NavBar
          setting={state.setting}
          channel={channel}
          currentChannel={currentChannel} />

        <div className="row">
          <Viewer
            item={currentItem}
            socket={state.socket} />

          <ItemList
            item={item}
            viewedItem={state.viewedItem}
            currentItemId={currentItemId} />
        </div>
      </div>
    );
  }
}

const container = FluxContainer.create(ContainerComponent);
export default container;
