import { default as React, Component } from 'react/addons';
import libdebug from 'debug';
const debug = libdebug('xeno:component:viewer');
import { Map } from 'immutable';

/*
 * global: $
 */

export default class Viewer extends Component {
  static propTypes = {
    setting:  React.PropTypes.instanceOf(Map).isRequired,
    currentItem:  React.PropTypes.object,
    socket: React.PropTypes.any,
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

  render() {
    const item = this.props.currentItem;

    if (!item) {
      debug('Viewer disabled');
      return null;
    }

    const height = Viewer._height(this.state);
    const rawEmbed = this._getRawEmbed(item);
    const ratio = this.props.setting.get('ratio', 'free');

    // calculate size in px

    const containerHeight = `${height}px`;

    const _containerStyle = ratio === 'free'
      ? { paddingBottom: containerHeight }
      : {};

    const _containerClass = `embed-responsive embed-responsive-${ratio}`;

    debug('Rendering viewer', item, _containerStyle, _containerClass);

    if (this.state.headerHeight === null || this.state.footerHeight === null) {
      window.setTimeout(() => {
        this.handleResize({});
      }, 20);
    }

    return (
      <article id="viewer">
        <header>
          <h2>{item.title}</h2>
        </header>

        <section className={_containerClass} style={_containerStyle} dangerouslySetInnerHTML={rawEmbed} />

        <footer>
          <a href={'https://www.reddit.com' + item.permalink}>{item.num_comments} comments</a>
        </footer>
      </article>
    );
  }
}
