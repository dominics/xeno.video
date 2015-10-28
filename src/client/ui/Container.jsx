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
    debug('Dispatching the first initialize event!');

    actions.get(initialize)({
      status: 'starting up the app!',
    });
  }

  static getStores() {
    return stores.toArray();
  }

  static calculateState(prevState) {
    debug('Got previous state', prevState);

    const state = stores.map((value) => {
      return value.getState();
    });

    debug('New state', state);

    return state;
  }

  render() {
    return (
      <div id="container">
        <NavBar
          setting={this.state.setting}
          channel={this.state.channel}
          currentChannel={this.state.currentChannel} />

        <div className="row">
          <Viewer item={this.state.currentItem} socket={this.state.socket} />

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
