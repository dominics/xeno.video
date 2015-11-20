import { default as React, Component } from 'react';
import ItemList from './item/List';
import Viewer from './Viewer';
import Menu from './menu/Menu';
import { Container as FluxContainer } from 'flux/utils';
import libdebug from 'debug';
import stores from './../store';
import registry from '../action';
import types from '../action/types';
import _ from 'lodash';
const debug = libdebug('xeno:component:container');

class ContainerComponent extends Component {
  componentDidMount() {
    debug('Initializing the app');
    registry.getCreator(types.initialize)(null, {
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

  _current(state) {
    const current = {
      itemId: state.currentItem,
      channelId: state.currentChannel.get(
        'selected',
        state.currentChannel.get('pending', null)
      ),
    };

    current.item = current.itemId
      ? state.item.get(current.itemId, null)
      : null;

    current.channel = current.channelId
      ? state.channel.get(current.channelId, null)
      : null;

    current.channelItems = current.channelId
      ? state.itemByChannel.get(current.channelId, []).map(itemId => state.item.get(itemId)).filter(v => !!v)
      : null;

    current.next = null;
    current.previous = null;

    if (current.item && current.channelItems) {
      const itemIndex = _.findIndex(current.channelItems, 'id', current.itemId);

      if (itemIndex < (current.channelItems.length - 1) && itemIndex >= 0) { // exclude -1
        current.next = current.channelItems[itemIndex + 1];
      }

      if (itemIndex > 0) {
        current.previous = current.channelItems[itemIndex - 1];
      }
    }

    return current;
  }

  render() {
    const current = this._current(this.state);

    return (
      <section className="container-fluid">
        <Menu
          setting={this.state.setting}
          channel={this.state.channel}
          currentChannel={current.channel} />

        <Viewer
          setting={this.state.setting}
          currentItem={current.item}
          socket={this.state.socket}
          next={current.next}
          previous={current.previous} />

        <ItemList
          currentChannelItems={current.channelItems}
          viewedItem={this.state.viewedItem}
          currentItemId={current.itemId}
          currentChannel={current.channel} />
      </section>
    );
  }

}

const container = FluxContainer.create(ContainerComponent, { pure: true });
export default container;
