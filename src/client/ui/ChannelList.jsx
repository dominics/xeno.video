import { default as React, Component } from 'react/addons';

import Channel from './Channel';
import libdebug from 'debug';
import { Map } from 'immutable';

const debug = libdebug('xeno:component:channelList');

/**
 * A channel-list is full of channels
 */
export default class ChannelList extends Component {
  static propTypes = {
    channel:        React.PropTypes.instanceOf(Map).isRequired,
    currentChannel: React.PropTypes.string,
  };

  /**
   * @param {Array} channels
   * @returns {Array.<Channel>}
   */
  channelNodes(channels) {
    if (!channels) {
      return [];
    }

    return channels.map(
      (channel) => {
        return (
          <Channel
            key={channel.id}
            id={'channel-' + channel.id}
            title={channel.title} />
        );
      }
    ).toArray();
  }

  render() {
    debug('Rendering channel list', this.props.channel);

    return (
      <ol className="channel-list nav nav-tabs">
        {this.channelNodes(this.props.channel)}
      </ol>
    );
  }
}
