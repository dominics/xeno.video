const React = require('react/addons');
import ChannelList from './ChannelList.jsx';
const debug = require('debug')('xeno:navbar');
const Channel = require('./Channel.jsx');

export default class NavBar extends React.Component {
  static propTypes = {
    channels:        React.PropTypes.arrayOf(React.PropTypes.instanceOf(Channel)),
    onChannelSelect: React.PropTypes.func.isRequired,
    settings: React.PropTypes.object,
    selected: React.PropTypes.instanceOf(Channel),
  };

  render() {
    return (
      <ChannelList
        channels={this.props.channels}
        selected={this.props.selected}
        onChannelSelect={this.props.onChannelSelect} />
    );
  }
}
