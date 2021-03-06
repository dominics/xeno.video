import { default as React, Component } from 'react';
import Item from './Item';
import { Map } from 'immutable';

import libdebug from 'debug';
const debug = libdebug('xeno:component:itemList');

/**
 * An item-list is full of items
 */
export default class ItemList extends Component {
  static propTypes = {
    currentItemId: React.PropTypes.string,
    currentChannelItems: React.PropTypes.array,
    currentChannelId: React.PropTypes.string,
    viewedItem: React.PropTypes.instanceOf(Map).isRequired,
  };

  itemNodes(items, selectedId) {
    return items.map(
      (item) => {
        return (
          <Item key={item.id}
                id={item.id}
                url={item.url}
                title={item.title}
                score={item.score}
                thumbnail={item.thumbnail}
                num_comments={item.num_comments}
                permalink={item.permalink}
                embed={item.embed}
                selected={(item.id === selectedId)}/>
        );
      }
    );
  }

  render() {
    if (!(this.props.currentChannelItems instanceof Array) || this.props.currentChannelItems.length === 0) {
      debug('Rendering disabled: no current items', this.props.currentChannelItems);
      return null;
    }

    debug('Rendering with current items', typeof this.props.currentChannelItems, this.props.currentChannelItems);
    const items = this.itemNodes(this.props.currentChannelItems, this.props.currentItemId);

    const title = this.props.currentChannelId ? <h2>{this.props.currentChannelId}</h2> : null;

    return (
      <nav className="item-list pull-right">
        {title}
        {items}
      </nav>
    );
  }
}
