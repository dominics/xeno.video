import { default as React, Component } from "react";
import libdebug from "debug";
import ChannelAdd from "./ChannelAdd";
import { Map } from "immutable";

const debug = libdebug("xeno:component:channel:dropdownSubscribed");

export default class DropdownSubscribed extends Component {
  static propTypes = {
    subscribed: React.PropTypes.instanceOf(Map).isRequired,
    current: React.PropTypes.string,
  };

  render() {
    debug("Rendering subscribed list", this.props.subscribed);

    if (!this.props.subscribed) {
      return null;
    }

    const channels = this.props.subscribed
      .map((channel) => {
        return (
          <ChannelAdd
            key={"add-" + channel.id}
            id={channel.id}
            selected={channel.id === this.props.current}
          />
        );
      })
      .toArray();

    return (
      <li className="dropdown" key="dropdown-subscribed">
        <a
          href="#"
          className="dropdown-toggle"
          data-toggle="dropdown"
          role="button"
          aria-haspopup="true"
          aria-expanded="false"
        >
          subreddits <span className="caret"></span>
        </a>
        <ul className="dropdown-menu">{channels}</ul>
      </li>
    );
  }
}
