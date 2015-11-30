import { default as React } from 'react';
import libdebug from 'debug';
import registry from '../../action';
import types from '../../action/types';

const debug = libdebug('xeno:component:favouriteChannel');

export default (props) => {
  const {id, selected} = props;

  return (
    <li className={'channel' + (selected ? ' active' : '')} id={'channel-' + id}>
      <a href="#" onClick={registry.getHandler(types.channelSelect).bind(undefined, id)} role="button">
        {id}
      </a>
    </li>
  );
};
