import { default as React, Component } from '../../../../node_modules/react/addons';

import libdebug from 'debug';
import { Map } from 'immutable';

const debug = libdebug('xeno:component:channel:search');

/**
 * Channel search widget on the navbar
 */
export default class Search extends Component {

  render() {
    debug('Rendering channel search');

    return (
      <form className="navbar-form navbar-left" role="search">
        <div className="form-group">
          <input type="text" className="form-control" placeholder="subreddit" />
        </div>
        <button type="submit" className="btn btn-default">
          <span className="fa fa-search" />
          Add
        </button>
      </form>
    );
  }
}
