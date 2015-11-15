import { default as React, Component } from 'react/addons';
import libdebug from 'debug';
import ChannelList from './ChannelList';
import { Map } from 'immutable';

const debug = libdebug('xeno:navbar');

export default class NavBar extends Component {
  static propTypes = {
    setting: React.PropTypes.object.isRequired,
    channel: React.PropTypes.instanceOf(Map).isRequired,
    currentChannel: React.PropTypes.object,
  };

  render() {
    return (
      <section>
        <ChannelList
          channel={this.props.channel}
          currentChannel={this.props.currentChannel} />
      </section>
    );
  }
}
