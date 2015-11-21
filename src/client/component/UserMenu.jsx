import { default as React, Component } from 'react/addons';
import libdebug from 'debug';

const debug = libdebug('xeno:component:UserMenu');

export default class UserMenu extends Component {
  static propTypes = {
    setting: React.PropTypes.object.isRequired,
  };

  static _slider(setting, state, title) {
    const id = 'setting-' + setting;

    return (
      <li key={id}>
        <div className="checkbox">
          <input type="checkbox" id={id} />
          <label htmlFor={id}>
            {title}
          </label>
        </div>
      </li>
    );
  }

  _options(settings) {
    const options = [];

    if (!settings.authenticated) {
      options.push(<li key="login"><a href="/login">Login with Reddit</a></li>);
      options.push(<li key="login-separator" role="separator" className="divider" />);
    }

    options.push(UserMenu._slider('autoplay', settings.autoplay, 'Autoplay'));
    options.push(UserMenu._slider('nsfw', settings.nsfw, 'Show NSFW'));

    if (settings.authenticated) {
      options.push(<li key="logout-separator" role="separator" className="divider" />);
      options.push(<li key="logout"><a href="/logout">Logout</a></li>);
    }

    return options;
  }

  _menu(settings) {
    const title = settings.authenticated ? settings.name : 'anonymous';
    const options = this._options(settings);

    const menu = (
      <ul className="dropdown-menu">
        {options}
      </ul>
    );

    return (
      <li className="dropdown">
        <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
          {title} <span className="caret"></span>
        </a>

        {menu}
      </li>
    );
  }

  render() {
    const settings = Object.assign({
      'authenticated': false,
      'name': null,
      'userId': null,
      'nsfw': false,
      'autoplay': true,
    }, this.props.setting.toJS());

    const menu = this._menu(settings);

    return (
      <ul className="nav navbar-nav navbar-right">
        <li><a href="/about">About</a></li>
        {menu}
      </ul>
    );
  }

}
