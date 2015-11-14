import { default as React, Component } from 'react/addons';
import libdebug from 'debug';
const debug = libdebug('xeno:render');
import Item from './Item';

export default class Viewer extends Component {
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

  render() {
    debug('Rendering viewer');

    if (!this.props.item) {
      debug('Viewer disabled');
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
