import { default as React, Component } from 'react/addons';
import Channel from './Channel';
import ItemList from './ItemList';
import Item from './Item';
import Viewer from './Viewer';
import NavBar from './NavBar';
import { Container as FluxContainer } from 'flux/utils';

import libdebug from 'debug';

const debug = libdebug('xeno:container');

import stores from './../stores';

class ContainerComponent extends Component {
  static propTypes = {
  };

  static getStores() {
    return stores.toArray();
  }

  static calculateState(prevState) {
    debug('Got previous state', prevState);

    return stores.map((value) => {
      return value.getState();
    });
  }

  render() {
    return (
      <div id="container">
        <NavBar
          setting={this.state.setting}
          channel={this.state.channel}
          currentChannel={this.state.currentChannel} />

        <div className="row">
          <Viewer item={this.state.currentItem} socket={this.state.socketStore} />

          <ItemList
            item={this.state.item}
            viewedItem={this.state.viewedItem}
            currentChannel={this.state.currentChannel}
            currentItem={this.state.currentItem} />
        </div>
      </div>
    );
  }
}

const container = FluxContainer.create(ContainerComponent);
export default container;
