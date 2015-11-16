import { default as React, Component } from '../../../../node_modules/react/addons';

import Channel from './../Channel';
import libdebug from 'debug';
import { Map } from 'immutable';

const debug = libdebug('xeno:component:channel:list');

/**
 * A channel-list is full of channels
 */
export default class List extends Component {
  static propTypes = {
    channel:        React.PropTypes.instanceOf(Map).isRequired,
    currentChannel: React.PropTypes.object,
  };

  /**
   * @param {Array} channels
   * @returns {Array.<Channel>}
   */
  channelNodes(channels) {
    if (!channels) {
      return [];
    }

    const currentId = this.props.currentChannel
      ? this.props.currentChannel.id
      : null;

    return channels.map(
      (channel) => {
        return (
          <Channel
            key={channel.id}
            id={channel.id}
            selected={channel.id === currentId}
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
