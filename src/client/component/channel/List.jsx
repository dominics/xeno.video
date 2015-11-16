import { default as React, Component } from 'react/addons';

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
      <ol className="nav navbar-nav">
        {this.channelNodes(this.props.channel)}

        /*
          <li className="dropdown">
            <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Dropdown <span className="caret"></span></a>
            <ul className="dropdown-menu">
              <li><a href="#">Action</a></li>
              <li><a href="#">Another action</a></li>
              <li><a href="#">Something else here</a></li>
              <li role="separator" className="divider"></li>
              <li><a href="#">Separated link</a></li>
              <li role="separator" className="divider"></li>
              <li><a href="#">One more separated link</a></li>
            </ul>
          </li>
         */
      </ol>



    );
  }
}
