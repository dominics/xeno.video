import { default as React, Component } from 'react';

import ListFavourites from './ListFavourites';
import DropdownMultis from './DropdownMultis';
import DropdownSubscribed from './DropdownSubscribed';
import CurrentIndicator from './CurrentIndicator';
import Search from './Search';

import libdebug from 'debug';
import { Map } from 'immutable';

const debug = libdebug('xeno:component:channel:list');

/**
 * A channel-list is full of channels
 */
export default class List extends Component {
  static propTypes = {
    channel:          React.PropTypes.instanceOf(Map).isRequired,
    favouriteChannel: React.PropTypes.instanceOf(Map).isRequired,
    currentChannel:   React.PropTypes.object,
  };

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

    const currentId = this.props.currentChannel
      ? this.props.currentChannel.id
      : null;

    const favourites = this.props.favouriteChannel.toArray();
    const subscribed = this.props.channel.get('subscribed', new Map());
    const multis = this.props.channel.get('multis', new Map());

    return (
      <ol className="nav navbar-nav">
        <CurrentIndicator id={currentId} />
        <ListFavourites current={currentId} favourites={favourites} />
        <DropdownSubscribed current={currentId} subscribed={subscribed} />
        <DropdownMultis current={currentId} multis={multis} />
      </ol>
    );
  }
}
