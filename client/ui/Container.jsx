const React = require('react/addons');

const ChannelList = require('./ChannelList.jsx');
const Channel = require('./Channel.jsx');
const ItemList = require('./ItemList.jsx');
const Item = require('./Item.jsx');
const Viewer = require('./Viewer.jsx');
const debug = require('debug');

module.exports = class Container extends React.Component {
  static propTypes = {
    url: React.PropTypes.string.isRequired,
    io: React.PropTypes.func,
  };

  constructor() {
    super();

    this.debug = debug('container');

    this.state = {
      data: {
        channels: [
          {id: 'all', title: 'All'},
        ],
      },
      selectedChannel: null,
      selectedItem: null,
    };
  }

  componentDidMount() {
    this.debug('Container did mount');

    this.io = this.props.io();

    this.io.emit('helo', navigator.userAgent);

    this.io.on('tv', () => {
      this.debug('Listening on tv socket');
    });

    this.getConfig();
  }

  getConfig() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: (data) => {
        this.debug('Mutating container state with updated data', data);
        this.setState(React.addons.update(this.state, {data: {$set: data}}));
      },
      error: (xhr, status, err) => {
        this.debug(this.props.url, status, err.toString());
      },
    });
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

    return (
      <div id="container">
        <ChannelList channels={channels} selected={this.state.selectedChannel} onChannelSelect={this.onChannelSelect.bind(this)} />
        <ItemList channel={this.state.selectedChannel} selected={this.state.selectedItem} onItemSelect={this.onItemSelect.bind(this)} />
        <Viewer item={this.state.selectedItem} />
      </div>
    );
  }
};
