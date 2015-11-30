import { default as React, Component } from 'react';
import ChannelAdd from './ChannelAdd';

export default (props) => {
  const { subscribed, current } = props;

  const channels = subscribed.map(
    (channel) => {
      return (
        <ChannelAdd
          key={channel.id}
          id={channel.id}
          selected={channel.id === current} />
      );
    }
  ).toArray();

  return (
    <li className="dropdown">
      <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
        Subreddits <span className="caret"></span>
      </a>
      <ul className="dropdown-menu">
        {channels}
      </ul>
    </li>
  );
};
