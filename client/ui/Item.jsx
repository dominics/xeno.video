const React = require('react/addons');

module.exports = class Item extends React.Component {
  static propTypes = {
    id: React.PropTypes.string.isRequired,
    url: React.PropTypes.string.isRequired,
    title: React.PropTypes.string.isRequired,
    onClick: React.PropTypes.func,
  };

  render() {
    return (
      <li className="item" id={'item-' + this.props.id} onClick={this.props.onClick.bind(undefined, this)}>
        {this.props.url}
        {this.props.title}
      </li>
    );
  }
};
