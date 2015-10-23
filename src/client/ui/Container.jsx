const React = require('react/addons');
import ChannelList from './ChannelList.jsx';
import Channel from './Channel.jsx';
import ItemList from './ItemList.jsx';
import Item from './Item.jsx';
import Viewer from './Viewer.jsx';
const debug = require('debug')('container');

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
  };

  componentDidMount() {
    debug('Container did mount');

    this.props.socket.emit('helo', navigator.userAgent);

    this.props.socket.on('tv', () => {
      debug('Listening on tv socket');
    });

    this.props.stores.channel.getAll().then(
      (channels) => {
        debug('Setting data.channels to', channels);
        this.setState(React.addons.update(this.state, {data: {channels: {$set: channels}}}));
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

    const channels = this.state.data.channels;
    const items    = this.state.data.items;

    const selChan = this.state.selectedChannel;
    const selItem = this.state.selectedItem;

    return (
      <div id="container">
        <ChannelList channels={channels} selected={selChan} onChannelSelect={this.onChannelSelect.bind(this)} />

        <div className="row">
          <Viewer item={selItem} />
          <ItemList items={items} channel={selChan} selected={selItem} onItemSelect={this.onItemSelect.bind(this)} />
        </div>
      </div>
    );
  }
}
