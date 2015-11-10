const React = require('react/addons');
const Item = require('./Item.jsx');
const Channel = require('./Channel.jsx');
const debug = require('debug');

/**
 * An item-list is full of items
 */
module.exports = class ItemList extends React.Component {
  static propTypes = {
    channel: React.PropTypes.instanceOf(Channel),
    selected: React.PropTypes.instanceOf(Item),
    children: React.PropTypes.arrayOf(React.PropTypes.instanceOf(Item)),
    onItemSelect: React.PropTypes.func.isRequired,
  }

  static defaultProps = {
    children: [],
  }

  constructor() {
    super();

    this.debug = debug('item-list');
  }

  itemNodes(items, selectedId, callback) {
    return items.map(
      (item) => {
        if (item.id === selectedId) {
          this.debug('Got selected ID', item);
        }

        return (
          <Item key={item.id} id={item.id} url={item.url} onClick={callback}/>
        );
      }
    );
  }

  render() {
    if (!this.props.channel) {
      return null;
    }

    const name = this.props.channel.props.name;
    const selectedId = (this.props.selected) ? this.props.selected.props.id : null;

    return (
      <div className="item-list">
        <h3>Items for {name}</h3>

        <ol className="item-list">
          {this.itemNodes(this.props.children, selectedId, this.props.onItemSelect)}
        </ol>
      </div>
    );
  }
};
