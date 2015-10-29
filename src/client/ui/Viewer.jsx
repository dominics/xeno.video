import { default as React, Component } from 'react/addons';
import libdebug from 'debug';
const debug = libdebug('xeno:render');
import Item from './Item';

export default class Viewer extends Component {
  static propTypes = {
    setting:  React.PropTypes.instanceOf(Map).isRequired,
    currentItem:  React.PropTypes.object,
    socket: React.PropTypes.any,
  };

  render() {
    const item  = this.props.currentItem;
    debug('Rendering viewer', item);

    if (!item) {
      debug('Viewer disabled');
      return null;
    }

    const ratio = this.props.setting.get('ratio');

    const rawEmbed        = item.embed;
    const responsiveRatio = (ratio === 'free' ? '' : `embed-responsive embed-responsive-${ratio}`);

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
