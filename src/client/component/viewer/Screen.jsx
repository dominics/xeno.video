import { default as React, Component } from "react";
import libdebug from "debug";
import _ from "lodash";
import registry from "./../../action";
import types from "./../../action/types";
import autoplay from "./../../action/autoplay";

const debug = libdebug("xeno:component:viewer:screen");

/*
 * global: $, playerjs, window
 */

export default class Screen extends Component {
  static propTypes = {
    embed: React.PropTypes.object.isRequired,
    autoplay: React.PropTypes.bool.isRequired,
    next: React.PropTypes.object,
  };

  iframeProperties(embed) {
    let src = embed.attr("src");

    if (this.props.autoplay) {
      src = src + "&autoplay=1";
    }

    debug("Source for iframe is", src);

    return {
      src: src,
      width: this.props.embed.width,
      height: this.props.embed.height,
      className: "embedly-embed",
      scrolling: "no",
      frameBorder: "0",
      allowFullScreen: "allowfullscreen",
    };
  }

  render() {
    if (!this.props.embed.content) {
      return <section id="screen" />;
    }

    debug("Screen is being rendered");

    const next = () => {
      if (!this.props.next) {
        debug("No next item, skipping autoplay continue");
        return;
      }

      debug("End of video, moving to next item");
      registry.getCreator(types.itemSelect)(null, this.props.next.id);
    };

    const debounced = _.debounce(autoplay, 1000);

    const reference = (ref) => {
      if (ref && this.props.autoplay && window.playerjs) {
        debug("Starting autoplay on ref", ref);
        debounced(ref, next);
      } else {
        debug("Autoplay disabled");
        debounced.cancel();
      }
    };

    const embed = $(this.props.embed.content);

    return !embed.is("iframe") || !embed.hasClass("embedly-embed") ? (
      <section
        id="screen"
        ref={reference}
        dangerouslySetInnerHTML={{ __html: this.props.embed.content }}
      />
    ) : (
      <section id="screen" ref={reference}>
        <iframe {...this.iframeProperties(embed)}></iframe>
      </section>
    );
  }
}
