import { default as React, Component } from 'react';
import CheckboxMenuItem from './setting/CheckboxMenuItem';
import types from './../action/types';
import registry from './../action';
import libdebug from 'debug';

const debug = libdebug('xeno:component:UserMenu');

export default class UserMenu extends Component {
  static propTypes = {
    setting: React.PropTypes.object.isRequired,
  };

  _options(settings) {
    const options = [];

    if (!settings.authenticated) {
      options.push(<li key="login"><a href="/login">Login with Reddit</a></li>);
      options.push(<li key="login-separator" role="separator" className="divider" />);
    }

    options.push(<CheckboxMenuItem key="autoplay" id="autoplay" checked={settings.autoplay} title="Autoplay" />);
    options.push(<CheckboxMenuItem key="nsfw" id="nsfw" checked={settings.nsfw} title="Show NSFW" />);

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
      <ul className="dropdown-menu dropdown-menu-right">
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

    debug('Rendering UserMenu with settings', settings);

    const menu = this._menu(settings);

    return (
      <ul className="nav navbar-nav navbar-right user-menu">
        <li><a href="/about">About</a></li>
        {menu}
      </ul>
    );
  }

}
