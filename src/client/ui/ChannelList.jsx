const React = require('react/addons');

import Channel from './Channel.jsx';

/**
 * A channel-list is full of channels
 */
export default class ChannelList extends React.Component {
  static propTypes = {
    channels:        React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
    onChannelSelect: React.PropTypes.func.isRequired,
    selected:        React.PropTypes.instanceOf(Channel),
  };

  static defaultProps = {
    channels: [],
    selected: null,
  };

  componentWillReceiveProps(nextProps) {
    if (!nextProps.selected && nextProps.channels.length > 0) {
      nextProps.selected = nextProps.channels[0];
    }
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
      <ol className="channel-list nav nav-tabs">
        {this.channelNodes(this.props.channels)}
      </ol>
    );
  }
}
