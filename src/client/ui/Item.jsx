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

  getRawEmbed() {
    return {
      __html: this.props.embed.content,
    };
  }

  render() {
    console.log(this.props);

    return (
      <li className="media" id={'item-' + this.props.id} onClick={this.props.onClick.bind(undefined, this)}>
        <div className="media-left media-top">
          <img className="media-object" src={this.props.thumbnail} alt={this.props.title} />
        </div>

        <article className="media-body">
          <h4>{this.props.title}</h4>
        </article>
      </li>
    );
  }
}
