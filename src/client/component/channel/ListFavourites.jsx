import { default as React } from 'react';
import libdebug from 'debug';
import ChannelFavourite from './ChannelFavourite';

const debug = libdebug('xeno:component:channel:listFavourites');

export default (props) => {
  const { current, favourites } = props; //

  debug('Rendering favourites', favourites);

  const items = favourites.map(
    (channel) => {
      return (
        <ChannelFavourite
          key={channel}
          id={channel}
          selected={channel === current}
        />
      );
    }
  );

  return (
    <ol className="nav navbar-nav">
      {items}
    </ol>
  );
};
