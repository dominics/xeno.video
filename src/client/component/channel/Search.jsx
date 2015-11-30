import { default as React, Component } from 'react';

import libdebug from 'debug';

const debug = libdebug('xeno:component:channel:search');

/**
 * Channel search widget on the navbar
 */
export default class Search extends Component {
  render() {
    debug('Rendering channel search'); //

    return (
      <form className="navbar-form navbar-left" role="search">
        <div className="form-group">
          <input type="text" className="form-control" placeholder="Subreddit, Multireddit" />
        </div> <button className="btn btn-success btn-sm">
          <span className="fa fa-plus" />
          <span> &nbsp; Add </span>
        </button>
      </form>
    );
  }
}
