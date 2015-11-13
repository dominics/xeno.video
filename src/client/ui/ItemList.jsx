const React = require('react/addons');
import Item from './Item.jsx';
import Channel from './Channel.jsx';
// const debug = require('debug')('xeno:item-list');

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
                score={item.score}
                thumbnail={item.thumbnail}
                num_comments={item.num_comments}
                permalink={item.permalink}
                embed={item.embed}
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

    const selectedId = (this.props.selected) ? this.props.selected.props.id : null;

    return (
      <nav className="col-md-4 col-xs-6 pull-right">
        <ol className="media-list">
          {this.itemNodes(this.props.items, selectedId, this.props.onItemSelect)}
        </ol>
      </nav>
    );
  }
}
