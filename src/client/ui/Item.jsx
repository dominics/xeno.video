const React = require('react/addons');

export default class Item extends React.Component {
  static propTypes = {
    id: React.PropTypes.string.isRequired,
    url: React.PropTypes.string.isRequired,
    title: React.PropTypes.string.isRequired,
    onClick: React.PropTypes.func.isRequired,
    selected: React.PropTypes.bool.isRequired,
    thumbnail: React.PropTypes.string.isRequired,
    embed: React.PropTypes.object.isRequired,
  };

  state = {
    unwatched: 3,
  };

  render() {
    console.log(this.props);

    return (
      <li className="list-group-item" id={'item-' + this.props.id} onClick={this.props.onClick.bind(undefined, this)}>
        <span className="badge">{this.state.unwatched}</span>

        {this.props.title}

      </li>
    );
  }
}
