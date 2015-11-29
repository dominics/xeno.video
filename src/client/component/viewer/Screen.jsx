import { default as React, Component } from 'react';
import libdebug from 'debug';
import _ from 'lodash';
import registry from './../../action';
import types from './../../action/types';
import autoplay from './../../action/autoplay';

const debug = libdebug('xeno:component:viewer:screen');

/*
 * global: $, playerjs, window
 */

export default class Screen extends Component {
  static propTypes = {
    embed:  React.PropTypes.object.isRequired,
    autoplay: React.PropTypes.bool.isRequired,
    next: React.PropTypes.object,
  };

  parsedContent(content) {
    const root = $(content);

    if (!root.is('iframe') || !root.hasClass('embedly-embed')) {
      return {
        raw: {
          __html: content,
        },
      };
    }

    return {
      src: root.attr('src'),
    };
  }

  render() {
    if (!this.props.embed.content) {
      return (<section id="screen" />);
    }

    debug('Screen is being rendered');

    const rawEmbed = {
      __html: this.props.embed.content,
    };

    const next = () => {
      if (!this.props.next) {
        debug('No next item, skipping autoplay continue');
        return;
      }

      registry.getCreator(types.itemSelect)(null, this.props.next.id);
    };

    const debounced = _.debounce(autoplay, 1000);

    const reference = (ref) => {
      if (ref && this.props.autoplay && window.playerjs) {
        debug('Starting autoplay on ref', ref);
        debounced(ref, next);
      } else {
        debug('Autoplay disabled');
        debounced.cancel();
      }
    };

    const content = this.parsedContent(this.props.embed.content); //

    return (
      typeof content.raw === 'object'
      ? <section id="screen" dangerouslySetInnerHTML={content.raw} />
      : (
        <section id="screen">
          <iframe
            className="embedly-embed"
            src={content.src}
            width={this.props.embed.width}
            height={this.props.embed.height}
            scrolling="no"
            frameBorder="0"
            allowFullScreen="allowfullscreen"
          ></iframe>
        </section>
      )
    );
  }
}
