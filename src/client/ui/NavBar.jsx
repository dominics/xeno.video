const React = require('react/addons');
import ChannelList from './ChannelList.jsx';
const debug = require('debug')('xeno:navbar');

export default class NavBar extends React.Component {
  static propTypes = {
    channels: React.PropTypes.object,
    settings: React.PropTypes.object,
    selected: //
  };


  render() {
    return (
      <ChannelList  selected={this.state.selectedChannel} onChannelSelect={this.onChannelSelect.bind(this)} />
    );
  }
}
