import { default as React, Component } from 'react/addons';

import Channel from './Channel';
import libdebug from 'debug';

const debug = libdebug('xeno:component:channelList');

/**
 * A channel-list is full of channels
 */
export default class ChannelList extends Component {
  static propTypes = {
    channels:        React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
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
          <Channel key={channel.id} id={channel.id} title={channel.title} />
        );
      }
    );
  }

  render() {
    debug('Rendering channel list');

    return (
      <ol className="channel-list nav nav-tabs">
        {this.channelNodes(this.props.channels)}
      </ol>
    );
  }
}
