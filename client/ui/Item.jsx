const React = require('react/addons');

module.exports = class Item extends React.Component {
  static propTypes = {
    key: React.PropTypes.string.isRequired,
    url: React.PropTypes.string.isRequired,
  }

  render() {
    return (
      <li className="item" id={'item-' + this.state.key}>{this.state.url}</li>
    );
  }
};
