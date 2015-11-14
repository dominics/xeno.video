import { default as React, Component } from 'react/addons';
import libdebug from 'debug';
import { default as actions, selectChannel } from '../action';
const debug = libdebug('xeno:component:channel');

export default class Channel extends Component {
  static propTypes = { //
    id: React.PropTypes.string.isRequired,
    title: React.PropTypes.string.isRequired,
  };

  render() {
    debug('Rendering channel');

    return (
      <li className="channel" id={'channel-' + this.props.id}>
        <a href="#" onClick={actions.getHandler(selectChannel).bind(undefined, this.props.id)} role="button">
          {this.props.title}
        </a>
      </li>
    );
  }
}
