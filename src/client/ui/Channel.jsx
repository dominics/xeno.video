import { React, Component } from 'react/addons';

export default class Channel extends Component {
  static propTypes = {
    id: React.PropTypes.string.isRequired,
    title: React.PropTypes.string.isRequired,
    onSelect: React.PropTypes.func.isRequired,
  };

  render() {
    return (
      <li className="channel" id={'channel-' + this.props.id}>
        <a href="#" onClick={this.props.onSelect.bind(undefined, this)} role="button">
          {this.props.title}
        </a>
      </li>
    );
  }
}
