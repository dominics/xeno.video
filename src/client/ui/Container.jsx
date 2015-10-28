import { default as React, Component } from 'react/addons';
import ItemList from './ItemList';
import Viewer from './Viewer';
import NavBar from './NavBar';
import { Container as FluxContainer } from 'flux/utils';
import libdebug from 'debug';
import stores from './../store';
import { default as actions, initialize } from '../action';
import { Map } from 'immutable';
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
    let state = (!(prevState instanceof Map) ? new Map() : prevState);
    debug('Got previous state', state.toJS());

    state = state.withMutations(map => {
      let mutated = map;

      for (const [key, value] of stores.entries()) {
        debug('Mutating store state', key, value.getState());
        mutated = mutated.set(key, value.getState());
      }

      return mutated;
    });

    debug('New state', state.toJS());

    return state;
  }

  render() {
    const state = this.state;
    debug('Rendering container, using state like', state.toJS());

    return (
      <div id="container">
        <NavBar
          setting={this.state.get('setting')}
          channel={this.state.get('channel')}
          currentChannel={this.state.get('currentChannel')} />

        <div className="row">
          <Viewer
            item={this.state.get('currentItem')}
            socket={this.state.get('socket')} />

          <ItemList
            item={this.state.get('item')}
            viewedItem={this.state.get('viewedItem')}
            currentChannel={this.state.get('currentChannel')}
            currentItem={this.state.get('currentItem')} />
        </div>
      </div>
    );
  }
}

const container = FluxContainer.create(ContainerComponent);
export default container;
