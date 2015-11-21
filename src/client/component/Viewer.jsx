import { default as React, Component } from 'react';
import libdebug from 'debug';
import { Map } from 'immutable';
import moment from 'moment';
import registry from './../action';
import types from './../action/types';

const debug = libdebug('xeno:component:viewer');

/*
 * global: $
 */

export default class Viewer extends Component {
  static propTypes = {
    setting:  React.PropTypes.instanceOf(Map).isRequired,
    currentItem:  React.PropTypes.object,
    socket: React.PropTypes.any,
    previous: React.PropTypes.object,
    next: React.PropTypes.object,
  };

  _getRawEmbed(item) {
    return {
      __html: item.embed.content,
    };
  }

  static _pagerButtons(props) {
    const next = props.next ? registry.getHandler(types.itemSelect).bind(undefined, props.next.id) : null;
    const previous = props.previous ? registry.getHandler(types.itemSelect).bind(undefined, props.previous.id) : null;

    return (
      <nav>
        <a href="#" rel="next" className={'btn btn-default goto-next pull-right' + (next !== null ? '' : ' disabled')} onClick={next}>
          Next <span className="fa fa-arrow-right"></span>
        </a>

        <a href="#" rel="prev" className={'btn btn-default goto-prev pull-left' + (previous !== null ? '' : ' disabled')} onClick={previous}>
          <span className="fa fa-arrow-left"></span> Previous
        </a>
      </nav>
    );
  }

  render() {
    const item = this.props.currentItem;

    if (!item) {
      return null;
    }

    const permalink = 'https://www.reddit.com' + item.permalink;
    const relativeDate = moment(item.created_utc * 1000).fromNow();
    const rawEmbed = this._getRawEmbed(item);

    return (
      <article id="viewer">
        <header>
          <h2>
            <a href={permalink}>
              {item.title}
            </a>
          </h2>
        </header>

        <section id="screen" dangerouslySetInnerHTML={rawEmbed} />

        <footer>
          {Viewer._pagerButtons(this.props)}

          <section className="info">
            <ul>
              <li>
                <a href={item.url}>
                  <span className="fa fa-external-link"></span>
                  {item.url}
                </a>
              </li>
              <li>
                <span className="fa fa-clock-o"></span>
                {relativeDate}
              </li>
              <li>
                <a href={permalink}>
                  <span className="fa fa-reddit"></span>
                  {item.num_comments} comments
                </a>
              </li>
            </ul>
          </section>
        </footer>
      </article>
    );
  }
}
