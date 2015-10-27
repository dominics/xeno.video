const React = require('react/addons');
const debug = require('debug')('xeno:render');
import Item from './Item.jsx';

export default class Viewer extends React.Component {
  static propTypes = {
    item:  React.PropTypes.instanceOf(Item),
    ratio: React.PropTypes.oneOf(['free', '4by3', '16by9']),
  };

  static defaultProps = {
    item:  null,
    ratio: 'free',
  };

  constructor() {
    super();
  }

  state = {};

  //getRawEmbed(item) {
  //  return {
  //    __html: item.embed.content,
  //  };
  //}

  render() {
    if (!this.props.item) {
      return null;
    }

    const item            = this.props.item.props;
    const rawEmbed        = this.props.item.getRawEmbed();
    const responsiveRatio = (this.props.ratio === 'free' ? '' : `embed-responsive embed-responsive-${this.props.ratio}`);

    return (
      <article id="viewer" className="panel col-md-9 pull-left">
        <header className="panel-heading">
          <h2>{item.title}</h2>
        </header>

        <section className="panel-body text-center">
          <div className={responsiveRatio} dangerouslySetInnerHTML={rawEmbed}/>
        </section>

        <section>
          <a href={'https://www.reddit.com' + item.permalink}>{item.num_comments} comments</a>
        </section>
      </article>
    );
  }
}
