import { default as React, Component } from "react";
import ChannelAdd from "./ChannelAdd";

export default (props) => {
  const { multis, current } = props;

  const channels = multis
    .map((channel) => {
      return (
        <ChannelAdd
          key={"add-multi-" + channel.id}
          id={"+" + channel.id}
          selected={channel.id === current}
        />
      );
    })
    .toArray();

  return (
    <li className="dropdown" key="dropdown-multis">
      <a
        href="#"
        className="dropdown-toggle"
        data-toggle="dropdown"
        role="button"
        aria-haspopup="true"
        aria-expanded="false"
      >
        multis <span className="caret"></span>
      </a>
      <ul className="dropdown-menu">{channels}</ul>
    </li>
  );
};
