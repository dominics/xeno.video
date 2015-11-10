const React = require('react/addons');
const Item = require('./Item.jsx');
const Channel = require('./Channel.jsx');
const debug = require('debug')('item-list');

/**
 * An item-list is full of items
 */
module.exports = class ItemList extends React.Component {
  static propTypes = {
    channel: React.PropTypes.instanceOf(Channel),
    selected: React.PropTypes.instanceOf(Item),
    items: React.PropTypes.arrayOf(React.PropTypes.object),
    onItemSelect: React.PropTypes.func.isRequired,
  };

  static defaultProps = {
    items: [],
  };

  constructor() {
    super();
  }

  itemNodes(items, selectedId, callback) {
    debug('Displaying item list', items);

    return items.map(
      (item) => {
        if (item.id === selectedId) {
          debug('Got selected ID', item);
        }

        return (
          <Item key={item.id} id={item.id} url={item.url} title={item.title} onClick={callback}/>
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
      <div className="item-list">
        <h3>Items for {name}</h3>

        <ol className="item-list">
          {this.itemNodes(this.props.items, selectedId, this.props.onItemSelect)}
        </ol>
      </div>
    );
  }
};
