import { default as React, Component } from 'react/addons';
import libdebug from 'debug';
import { default as actions, selectItem } from '../action';

const debug = libdebug('xeno:component:item');

export default class Item extends Component {
  static propTypes = {
    id: React.PropTypes.string.isRequired,
    url: React.PropTypes.string.isRequired,
    title: React.PropTypes.string.isRequired,
    selected: React.PropTypes.bool.isRequired,
    thumbnail: React.PropTypes.object.isRequired,
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
      <li className="item" id={'item-' + this.props.id} onClick={actions.get(selectItem)}>
        <a href="#" className="thumbnail">
          <img
            className="media-object"
            src={this.props.thumbnail.url}
            alt={this.props.title}
            width={this.props.thumbnail.width}
            height={this.props.thumbnail.height}
          />

          <article className="caption">
            <h4>{this.props.title}</h4>
          </article>
        </a>
      </li>
    );
  }
}
