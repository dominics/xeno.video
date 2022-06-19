import { default as React, Component } from "react";
import libdebug from "debug";
import ChannelList from "./../channel/List";
import MenuUser from "./MenuUser";
import { Map, List } from "immutable";

const debug = libdebug("xeno:component:navBar");

export default class Menu extends Component {
  static propTypes = {
    setting: React.PropTypes.object.isRequired,
    channel: React.PropTypes.instanceOf(Map).isRequired,
    favouriteChannel: React.PropTypes.instanceOf(List).isRequired,
    currentChannelId: React.PropTypes.string,
  };

  /**
   * @returns {XML}
   */
  render() {
    return (
      <nav className="navbar navbar-default navbar-fixed-top">
        <section className="container-fluid">
          <div className="navbar-header">
            <button
              type="button"
              className="navbar-toggle collapsed"
              data-toggle="collapse"
              data-target="#bs-example-navbar-collapse-1"
              aria-expanded="false"
            >
              <span className="sr-only" />
              <span className="fa fa-bars" />
            </button>

            <a className="navbar-brand" href="#">
              <span className="icomoon-logo" />
              <h1>xeno.video</h1>
            </a>
          </div>

          <div
            className="collapse navbar-collapse"
            id="bs-example-navbar-collapse-1"
          >
            <ChannelList
              channel={this.props.channel}
              currentChannelId={this.props.currentChannelId}
              favouriteChannel={this.props.favouriteChannel}
            />

            <MenuUser
              setting={this.props.setting}
              favouriteChannel={this.props.favouriteChannel}
            />
          </div>
        </section>
      </nav>
    );
  }
}
