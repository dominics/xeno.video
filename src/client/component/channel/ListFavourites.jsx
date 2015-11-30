import { default as React, Component } from 'react';

import ChannelFavourite from './ChannelFavourite';

export default ({ current, favourites }) => {
  return favourites.map(
    (channel) => {
      return (
        <ChannelFavourite id={channel.id} selected={channel.id === current} />
      );
    }
  );
};
