import { default as React, Component } from 'react/addons';
import libdebug from 'debug';
const debug = libdebug('xeno:component:viewer');
import { Map } from 'immutable';

export default class Viewer extends Component {
  static propTypes = {
    setting:  React.PropTypes.instanceOf(Map).isRequired,
    currentItem:  React.PropTypes.object,
    socket: React.PropTypes.any,
  };

  _getRawEmbed(item) {
    return {
      __html: item.embed.content,
    };
  }

  render() {
    const item = this.props.currentItem;

    if (!item) {
      debug('Viewer disabled');
      return null;
    }

    debug('Rendering viewer', item);

    const rawEmbed = this._getRawEmbed(item);
    const ratio = this.props.setting.get('ratio', 'free');

    const containerStyle = ratio === 'free'
      ? { paddingBottom: `${(item.embed.height / item.embed.width) * 100}%` }
      : {};

    return (
      <article id="viewer" className="panel col-md-8 pull-left">
        <header className="panel-heading">
          <h2>{item.title}</h2>
        </header>

        <section className="panel-body text-center">
          <div className={`embed-responsive embed-responsive-${ratio}`} style={containerStyle} dangerouslySetInnerHTML={rawEmbed}/>
        </section>

        <section>
          <a href={'https://www.reddit.com' + item.permalink}>{item.num_comments} comments</a>
        </section>
      </article>
    );
  }
}
