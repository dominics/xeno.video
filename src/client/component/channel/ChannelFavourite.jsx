import { default as React, Component } from 'react';
import libdebug from 'debug';
import registry from '../../action';
import types from '../../action/types';
const debug = libdebug('xeno:component:favouriteChannel');

export default (props) => {
  const {id, selected} = props;

  return (
    <li className={'channel' + (this.props.selected ? ' active' : '')} id={'channel-' + this.props.id}>
      <a href="#" onClick={registry.getHandler(types.channelSelect).bind(undefined, this.props.id)} role="button">
        {this.props.id}
      </a>
    </li>
  );
};
