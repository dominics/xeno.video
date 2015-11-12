const React = require('react/addons');
import Item from './Item.jsx';
import Channel from './Channel.jsx';
// const debug = require('debug')('item-list');

/**
 * An item-list is full of items
 */
export default class ItemList extends React.Component {
  static propTypes = {
    channel: React.PropTypes.instanceOf(Channel),
    selected: React.PropTypes.instanceOf(Item),
    items: React.PropTypes.arrayOf(React.PropTypes.object),
    onItemSelect: React.PropTypes.func.isRequired,
  };

  static defaultProps = {
    items: [],
  };

  itemNodes(items, selectedId, callback) {
    return items.map(
      (item) => {
        return (
          <Item key={item.id}
                id={item.id}
                url={item.url}
                title={item.title}
                onClick={callback}
                selected={(item.id === selectedId)}/>
        );
      }
    );
  }

  render() {
    if (!this.props.channel) {
      return null;
    }

    const name = this.props.channel.props.title;
    const selectedId = (this.props.selected) ? this.props.selected.props.id : null;

    return (
      <div className="item-list col-md-3 pull-right">
        <h3>Items for {name}</h3>

        <ol className="list-group">
          {this.itemNodes(this.props.items, selectedId, this.props.onItemSelect)}
        </ol>
      </div>
    );
  }
}
