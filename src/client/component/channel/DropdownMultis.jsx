import { default as React, Component } from 'react';

export default (props) => {
  const { multis, current } = props;

  const channels = multis.map(
    (channel) => {
      return (
        <ChannelAdd
          key={channel.id}
          id={'+' + channel.id}
          selected={channel.id === currentId} />
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
}
