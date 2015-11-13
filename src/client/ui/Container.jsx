const React = require('react/addons');
import ChannelList from './ChannelList.jsx';
import Channel from './Channel.jsx';
import ItemList from './ItemList.jsx';
import Item from './Item.jsx';
import Viewer from './Viewer.jsx';
import NavBar from './NavBar.jsx';
const debug = require('debug')('xeno:container');

export default class Container extends React.Component {
  static propTypes = {
    socket: React.PropTypes.object,
    stores: React.PropTypes.object,
  };

  state = {
    data: {
      channels: [],
    },
    selectedChannel: null,
    selectedItem: null,
    settings: {},
  };

  componentDidMount() {
    debug('Container did mount');

    this.props.socket.emit('helo', navigator.userAgent);

    this.props.socket.on('tv', () => {
      debug('Listening on tv socket');
    });

    this.props.stores.settings.getAll().then(settings => {
      this.setState(React.addons.update(this.state, {data: {settings: {$set: settings}}}));
    });

    this.props.stores.channel.getAll().then(
      (channels) => {
        debug('Setting data.channels to', channels);
        this.setState(React.addons.update(this.state, {data: {channels: {$set: channels}}}));
        this.onChannelSelect(channels[0], { state: 'initial mount, set as default channel' });
      },
      (err) => {
        debug(err);
      }
    );
  }

  /**
   * @param channel Channel
   * @param e SyntheticEvent
   */
  onChannelSelect(channel, e) {
    if (!channel instanceof Channel) { //
      throw new Error('Invalid channel selected', e);
    }

    this.setState(React.addons.update(this.state, {
      selectedChannel: {$set: channel},
    }));

    this.props.stores.item.getAllForChannel(channel).then(
      (items) => {
        this.setState(React.addons.update(this.state, {data: {items: {$set: items}}}));
        this.onItemSelect(items[0], { state: 'initial channel load, set as default item' });
      },
      (err) => {
        debug('Error', err);
      }
    );
  }

  /**
   * @param item Item
   * @param e SyntheticEvent
   */
  onItemSelect(item, e) {
    if (!item instanceof Item) { //
      throw new Error('Invalid item selected', e);
    }

    this.setState(React.addons.update(this.state, {
      selectedItem: {$set: item},
    }));
  }

  render() {
    if (typeof this.state.data === 'undefined') {
      return null;
    }

    const items    = this.state.data.items;

    return (
      <div id="container">
        <NavBar
          settings={this.state.data.settings}
          channels={this.state.data.channels}
          selected={this.state.selectedChannel}
          onChannelSelect={this.onChannelSelect.bind(this)}/>

        <div className="row">
          {this.state.selectedChannel
            ? <h2>{this.state.selectedChannel.props.name}</h2>
            : <p>Select a channel to get started</p>}

          <Viewer item={this.state.selectedItem} />

          <ItemList
            items={items}
            channel={this.state.selectedChannel}
            selected={this.state.selectedItem}
            onItemSelect={this.onItemSelect.bind(this)} />
        </div>
      </div>
    );
  }
}
