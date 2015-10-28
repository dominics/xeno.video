import { default as React, Component } from 'react/addons';
import Item from './Item';
import Channel from './Channel';

import libdebug from 'debug';
const debug = libdebug('xeno:item-list');


/**
 * An item-list is full of items
 */
export default class ItemList extends Component {
  static propTypes = {
    channel: React.PropTypes.instanceOf(Channel),
    selected: React.PropTypes.instanceOf(Item),
    items: React.PropTypes.arrayOf(React.PropTypes.object),
  };

  static defaultProps = {
    items: [],
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
    if (!this.props.channel) {
      return null;
    }

    const selectedId = (this.props.selected) ? this.props.selected.props.id : null;

    return (
      <nav className="col-md-4 col-xs-6 pull-right">
        <ol className="media-list">
          {this.itemNodes(this.props.items, selectedId)}
        </ol>
      </nav>
    );
  }
}
