import { default as React, Component } from 'react';
import libdebug from 'debug';
import registry from './../../action';
import types from './../../action/types';

const debug = libdebug('xeno:component:viewer:screen');

/*
 * global: $, playerjs, window
 */

export default class Screen extends Component {
  static propTypes = {
    embed:  React.PropTypes.object.isRequired,
    autoplay: React.PropTypes.bool.isRequired,
    next: React.PropTypes.object.isRequired,
  };

  componentDidMount() {
    if (this.iframe && this.props.autoplay) {
      this.startAutoplay();
    } else {
      debug('Not autoplaying: missing iframe or autoplay disabled');
    }
  }

  componentWillUnmount() {
    this.player = null; // https://github.com/embedly/player.js/issues/20
    this.iframe = null;
  }

  player = null;
  iframe = null;

  startAutoplay() {
    // Attach this.section to player
    debug('Attaching player.js');
    this.player = window.playerjs.Player(iframe);

    this.player.on('ready', () => {
      debug('Player is ready, starting play');
      this.player.play();
    });

    this.player.on('ended', () => {
      if (!this.props.next) {
        debug('No next item, skipping autoplay continue');
        return;
      }

      registry.getCreator(types.itemSelect)(null, this.props.next.id);
    });
  }

  render() {
    if (!this.props.embed.content) {
      return null;
    }

    if (!window.playerjs) {
      return null;
    }

    const rawEmbed = {
      __html: this.props.embed.content,
    };

    const ref = (section) => {
      if (!section) {
        this.iframe = null;
        return;
      }

      const iframe = $(section).find('iframe').eq(0);

      if (iframe) {
        this.iframe = iframe;
      }
    };

    return (
      <section id="screen" ref={ref} dangerouslySetInnerHTML={rawEmbed} />
    );
  }
}
