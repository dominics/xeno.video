import { default as React, Component } from "react";
import registry from "../../action";
import types from "../../action/types";
import libdebug from "debug";

const debug = libdebug("xeno:component:channel:search");

/**
 * Channel search widget on the navbar
 */
export default class Search extends Component {
  state = {
    open: false,
  };

  setSearchInput(ref) {
    debug("Received search input", ref);
    this.searchInput = ref;
  }

  onAdd(event) {
    event.preventDefault();
    event.stopPropagation();

    if (!this.searchInput) {
      debug("Add button clicked, no search input found");
      return false;
    }

    const channel = $(this.searchInput).val();

    this.setState({ open: false });

    if (!channel) {
      debug("Add button clicked, no channel value");
      return false;
    }

    debug("Add button clicked, dispatching add");
    return registry.getHandler(types.channelAdd, true)(channel, event);
  }

  onOpen(event) {
    this.setState({
      open: true,
    });

    event.preventDefault();
    event.stopPropagation();

    return false;
  }

  render() {
    debug("Rendering channel search");

    return this.state.open ? (
      <li className="search" key="search-form">
        <form className="navbar-form navbar-left" role="search">
          <input
            type="text"
            className="form-control"
            placeholder="subreddit"
            ref={this.setSearchInput.bind(this)}
          />
          &nbsp;
          <button
            className="btn btn-default btn-sm"
            onClick={this.onAdd.bind(this)}
          >
            <span className="fa fa-plus" />
            <span> &nbsp; Add </span>
          </button>
        </form>
      </li>
    ) : (
      <li className="search-open" key="search-form">
        <form className="navbar-form navbar-left" role="search">
          <button
            className="btn btn-default btn-sm"
            onClick={this.onOpen.bind(this)}
          >
            <span className="fa fa-search" />
          </button>
        </form>
      </li>
    );
  }
}
