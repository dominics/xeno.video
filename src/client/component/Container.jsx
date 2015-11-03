import { default as React, Component } from 'react/addons';
import ItemList from './item/List';
import Viewer from './Viewer';
import NavBar from './NavBar';
import { Container as FluxContainer } from 'flux/utils';
import libdebug from 'debug';
import stores from './../store';
import { registry, initialize } from '../action';
import _ from 'lodash';
const debug = libdebug('xeno:component:container');

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

    let hasNext = false;
    let hasPrevious = false;

    if (currentItem && currentChannelItems) {
      const currentItemIndex = _.findIndex(currentChannelItems, (v) => v.id === currentItemId);

      hasPrevious = currentItemIndex > 0;
      hasNext = currentItemIndex < (currentChannelItems.length - 1);
    }

    return (
      <section className="container-fluid">
        <NavBar
          setting={state.setting}
          channel={channel}
          currentChannel={currentChannel} />

        <ItemList
          currentChannelItems={currentChannelItems}
          viewedItem={state.viewedItem}
          currentItemId={currentItemId} />

        <section id="viewer-container">
          <Viewer
            setting={state.setting}
            currentItem={currentItem}
            socket={state.socket}
            hasNext={hasNext}
            hasPrevious={hasPrevious} />
        </section>
      </section>
    );
  }

}

const container = FluxContainer.create(ContainerComponent, { pure: true });
export default container;
