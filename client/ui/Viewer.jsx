const React = require('react/addons');
const Item = require('./Item.jsx');
const VideoRenderer = require('./render/VideoRenderer.jsx');

module.exports = class Viewer extends React.Component {
  static propTypes = {
    item: React.PropTypes.instanceOf(Item),
  };

  static defaultProps = {
    item: null,
  };

  state = {};

  constructor() {
    super();

    this.renderer = new VideoRenderer(this);
  }

  render() {
    if (!this.props.item) {
      return null;
    }

    const item = this.props.item.props;

    return (
      <div className="row">
        <div id="viewer" className="col-md-12">
          <h1>{item.title}</h1>

          {this.renderer.render(item.url)}
        </div>
      </div>
    );
  }
};
