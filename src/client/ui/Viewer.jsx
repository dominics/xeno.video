const React = require('react/addons');
const debug = require('debug')('render');
import Item from './Item.jsx';
import VideoRenderer from './../../video/VideoRenderer.jsx';

export default class Viewer extends React.Component {
  static propTypes = {
    item: React.PropTypes.instanceOf(Item),
  };

  static defaultProps = {
    item: null,
  };

  constructor() {
    super();

    this.renderer = new VideoRenderer(this);
  }

  state = {};

  render() {
    if (!this.props.item) {
      return null;
    }

    const item = this.props.item.props;
    const rendered = this.renderer.render(item.url);

    debug('viewewr render', rendered);

    return (
      <article id="viewer" className="panel col-md-9 pull-left">
        <header className="panel-heading">
          <h1>{item.title}</h1>
        </header>

        <section className="panel-body">
          <div className="embed-responsive embed-responsive-16by9">
            {rendered}
          </div>
        </section>
      </article>
    );
  }
}
