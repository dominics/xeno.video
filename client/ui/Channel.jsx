const React = require('react/addons');

module.exports = class Channel extends React.Component {
  static propTypes = {
    id: React.PropTypes.string.isRequired,
    title: React.PropTypes.string.isRequired,
    onSelect: React.PropTypes.func.isRequired,
  };

  render() {
    return (
      <div className="channel" id={'channel-' + this.props.id} onClick={this.props.onSelect.bind(undefined, this)}>
        {this.props.title}
      </div>
    );
  }
};
