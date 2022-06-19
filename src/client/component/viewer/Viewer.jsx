import { default as React, Component } from "react";
import libdebug from "debug";
import { Map } from "immutable";
import Pager from "./Pager";
import Screen from "./Screen";
import Info from "./Info";

const debug = libdebug("xeno:component:viewer");

/*
 * global: $
 */

export default class Viewer extends Component {
  static propTypes = {
    setting: React.PropTypes.instanceOf(Map).isRequired,
    currentItem: React.PropTypes.object,
    socket: React.PropTypes.any,
    previous: React.PropTypes.object,
    next: React.PropTypes.object,
  };

  render() {
    const item = this.props.currentItem;

    if (!item) {
      return null;
    }

    const commentsUrl = "https://www.reddit.com" + item.permalink;

    return (
      <article id="viewer">
        <header>
          <h2>
            <a href={commentsUrl}>{item.title}</a>
          </h2>
        </header>

        <Screen
          embed={item.embed}
          autoplay={this.props.setting.get("autoplay").value}
          next={this.props.next}
        />

        <footer>
          <Pager next={this.props.next} previous={this.props.previous} />

          <Info
            url={item.url}
            commentsUrl={commentsUrl}
            createdUtc={item.created_utc}
            numComments={item.num_comments}
          />
        </footer>
      </article>
    );
  }
}
