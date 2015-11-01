import { default as React, Component } from '../../../node_modules/react/addons';
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

  state = {
    containerHeight: null,
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
    });
  }

  _getRawEmbed(item) {
    return {
      __html: item.embed.content,
    };
  }

  render() {
    const item = this.props.currentItem;

    if (!item || !this.state.containerHeight) {
      debug('Viewer disabled');
      return null;
    }

    const rawEmbed = this._getRawEmbed(item);
    const ratio = this.props.setting.get('ratio', 'free');

    // calculate size in px

    const containerHeight = `${this.state.containerHeight - 60}px`;

    const _containerStyle = ratio === 'free'
      ? { paddingBottom: containerHeight }
      : {};

    const _containerClass = `embed-responsive embed-responsive-${ratio}`;

    debug('Rendering viewer', item, _containerStyle, _containerClass);

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
