import { default as React, Component } from 'react';
import libdebug from 'debug';
import registry from '../../action';
import types from '../../action/types';
const debug = libdebug('xeno:component:channel');

export default class Channel extends Component {
  static propTypes = { //
    id: React.PropTypes.string.isRequired,
    title: React.PropTypes.string.isRequired,
    selected: React.PropTypes.bool.isRequired,
  };

  render() {
    debug('Rendering channel');

    return (
      <li className={'channel' + (this.props.selected ? ' active' : '')} id={'channel-' + this.props.id}>
        <a href="#" onClick={registry.getHandler(types.channelSelect).bind(undefined, this.props.id)} role="button">
          {this.props.title}
        </a>
      </li>
    );
  }
}