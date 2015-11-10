const React = require('react/addons');

module.exports = class Item extends React.Component {
  static propTypes = {
    id: React.PropTypes.string.isRequired,
    url: React.PropTypes.string.isRequired,
    title: React.PropTypes.string.isRequired,
  };

  render() {
    return (
      <li className="item" id={'item-' + this.props.id}>
        <a href={this.props.url}>
          {this.props.title}
        </a>
      </li>
    );
  }
};
