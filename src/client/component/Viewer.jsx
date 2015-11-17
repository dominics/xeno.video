import { default as React, Component } from 'react/addons';
import libdebug from 'debug';
import { Map } from 'immutable';
import moment from 'moment';

const debug = libdebug('xeno:component:viewer');

/*
 * global: $
 */

export default class Viewer extends Component {
  static propTypes = {
    setting:  React.PropTypes.instanceOf(Map).isRequired,
    currentItem:  React.PropTypes.object,
    socket: React.PropTypes.any,
    hasPrevious: React.PropTypes.bool.isRequired,
    hasNext: React.PropTypes.bool.isRequired,
  };

  componentDidMount() {
    window.addEventListener('resize', this.handleResize.bind(this));
    this.handleResize({});
  }

  componentWillReceiveProps() {
    this.handleResize({});
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize.bind(this));
  }

  handleResize(_event) {
    this.setState({
      containerHeight: $('#viewer-container').innerHeight(),
      headerHeight: $('#viewer').find('> header').outerHeight() || null,
      footerHeight: $('#viewer').find('> footer').outerHeight() || null,
      offset: 0,
    });
  }

  _getRawEmbed(item) {
    return {
      __html: item.embed.content,
    };
  }

  static _height(state) {
    if (
      !state
      || !state.containerHeight
    ) {
      return 400;
    }

    return state.containerHeight
      - state.headerHeight
      - state.footerHeight
      - state.offset;
  }

  static _pagerButtons(hasNext, hasPrevious) {
    return (
      <nav>
        <a href="#" rel="next" className={'btn btn-default goto-next pull-right' + (hasNext ? '' : ' disabled')}>
          Next <span className="fa fa-arrow-right"></span>
        </a>

        <a href="#" rel="prev" className={'btn btn-default goto-prev pull-left' + (hasPrevious ? '' : ' disabled')}>
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

    if (this.state.headerHeight === null || this.state.footerHeight === null) {
      window.setTimeout(() => { // hacky mchackity
        this.handleResize({});
      }, 0);
    }

    const permalink = 'https://www.reddit.com' + item.permalink;
    const relativeDate = moment(item.created_utc * 1000).fromNow();
    const height = Viewer._height(this.state);
    const rawEmbed = this._getRawEmbed(item);
    const ratio = this.props.setting.get('ratio', 'free');
    const containerHeight = `${height}px`;
    const containerClass = `embed-responsive embed-responsive-${ratio}`;
    const containerStyle = ratio === 'free'
      ? { paddingBottom: containerHeight }
      : {};

    return (
      <article id="viewer">
        <header>
          <h2>
            <a href={permalink}>
              {item.title}
            </a>
          </h2>
        </header>

        <section className={containerClass} style={containerStyle} dangerouslySetInnerHTML={rawEmbed} />

        <footer>
          {Viewer._pagerButtons(this.props.hasNext, this.props.hasPrevious)}

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
