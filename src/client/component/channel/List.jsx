import { default as React, Component } from 'react';

import Channel from './Channel';
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
   * @param {Immutable.Map} channels
   * @returns {Array.<Channel>}
   */
  defaultNodes(channels) {
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

  /**
   * @param {Immutable.Map} subscribed
   * @returns {Array.<Channel>}
   */
  subscribedDropdown(subscribed) {
    if (!subscribed) {
      return [];
    }

    const currentId = this.props.currentChannel
      ? this.props.currentChannel.id
      : null;

    const channels = subscribed.map(
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

    return (
      <li className="dropdown">
        <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
          Subreddits <span className="caret"></span>
        </a>
        <ul className="dropdown-menu">
          {channels}
        </ul>
      </li>
    );
  }

  /**
   * From left to right:
   *   - The current channel, if there is one
   *   - The list of bookmarked videos, in LRU order
   *   - If the user is logged in, a drop-down of subreddits they are subscribed to
   *   - If the user is logged in, a drop-down of their multis
   *   - A search box for adding subreddits by name
   *
   * @returns {XML}
   */
  render() {
    debug('Rendering channel list', this.props.channel);

    return (
      <ol className="nav navbar-nav">

        {this.defaultNodes(this.props.channel.get('defaults', new Map()))}
        {this.subscribedDropdown(this.props.channel.get('subscribed', new Map()))}
      </ol>
    );
  }
}
