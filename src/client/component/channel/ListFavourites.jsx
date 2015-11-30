import { default as React } from 'react';

import ChannelFavourite from './ChannelFavourite';

export default (props) => {
  const { current, favourites } = props; //

  const items = favourites.map(
    (channel) => {
      return (
        <ChannelFavourite
          key={channel.id}
          id={channel.id}
          selected={channel.id === current}
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
