import { default as React, Component } from 'react/addons';
import libdebug from 'debug';
import registry from './../../action';
import types from './../../action/types';

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

  getRawEmbed() {
    return {
      __html: this.props.embed.content,
    };
  }

  render() {
    const click = registry.getHandler(types.itemSelect).bind(undefined, this.props.id);

    return (
      <article className={'item' + (this.props.selected ? ' active' : '')} id={'item-' + this.props.id} onClick={click}>
        <h4>
          {this.props.selected ? <span className="playing-indicator fa "></span> : null}
          {this.props.title}
        </h4>
        <div className="item-thumbnail" style={{ backgroundImage: 'url("' + this.props.thumbnail.url + '")' }}>
          <img
            src={this.props.thumbnail.url}
            alt={this.props.title}
          />
        </div>
      </article>
    );
  }
}
