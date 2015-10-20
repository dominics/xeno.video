const React = require('react/addons');

module.exports = class Channel extends React.Component {
  static propTypes = {
    name: React.PropTypes.string.isRequired,
    title: React.PropTypes.string.isRequired,
    onSelect: React.PropTypes.func.isRequired,
  }

  render() {
    return (
      <div className="channel" id={'channel-' + this.props.name} onClick={this.props.onSelect.bind(undefined, this)}>
        {this.props.title}
      </div>
    );
  }
};
