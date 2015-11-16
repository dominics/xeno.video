import { default as React, Component } from 'react/addons';
import libdebug from 'debug';

const debug = libdebug('xeno:component:UserMenu');

export default class UserMenu extends Component {
  render() {
    return (
      <ul className="nav navbar-nav navbar-right">
        <li><a href="/about">About</a></li>
        <li className="dropdown">
          <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
            Logged In <span className="caret"></span>
          </a>
          <ul className="dropdown-menu">
            <li><a href="#">Setting</a></li>
            <li><a href="#">Another setting</a></li>
            <li role="separator" className="divider"></li>
            <li><a href="/logout">Logout</a></li>
          </ul>
        </li>
      </ul>
    );
  }
}
