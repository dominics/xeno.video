import { default as React, Component } from 'react/addons';
import libdebug from 'debug';
import ChannelList from './ChannelList';
const debug = libdebug('xeno:navbar');
const Channel = require('./Channel.jsx');

export default class NavBar extends Component {
  static propTypes = {
    channels: React.PropTypes.arrayOf(React.PropTypes.instanceOf(Channel)),
    settings: React.PropTypes.object,
    selected: React.PropTypes.instanceOf(Channel),
  };

  render() {
    return (
      <ChannelList
        channels={this.props.channels}
        selected={this.props.selected} />
    );
  }
}
