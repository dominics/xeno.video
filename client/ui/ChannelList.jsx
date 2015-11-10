const React = require('react/addons');

const Channel = require('./Channel.jsx');

/**
 * A channel-list is full of channels
 */
module.exports = class ChannelList extends React.Component {
  static propTypes = {
    channels: React.PropTypes.arrayOf(React.PropTypes.object),
    onChannelSelect: React.PropTypes.func.isRequired,
  }

  static defaultProps = {
    channels: [],
  }

  channelNodes(channels) {
    return channels.map(
      (channel) => {
        return (
          <Channel key={channel.id} id={channel.id} title={channel.title} onSelect={this.props.onChannelSelect}/>
        );
      }
    );
  }

  render() {
    return (
      <ol className="channel-list">
        {this.channelNodes(this.props.channels)}
      </ol>
    );
  }
};
