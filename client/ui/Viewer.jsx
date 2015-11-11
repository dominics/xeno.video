const React = require('react/addons');
const Item = require('./Item.jsx');

module.exports = class Viewer extends React.Component {
  static propTypes = {
    item: React.PropTypes.instanceOf(Item),
  };

  static defaultProps = {
    item: null,
  };

  state = {};

  render() {
    if (!this.props.item) {
      return null;
    }

    return (
      <div id="viewer">
        <h2>Viewer</h2>

        <a href={this.props.item.props.url}>{this.props.item.props.url}</a>
      </div>
    );
  }
};
