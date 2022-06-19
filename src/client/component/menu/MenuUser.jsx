import { default as React } from "react";
import MenuUserSettings from "./MenuUserSettings";
import libdebug from "debug";

const debug = libdebug("xeno:component:UserMenu");

export default function MenuUser({ setting, favouriteChannel }) {
  const title = setting.get("authenticated").value
    ? setting.get("name").value
    : "anonymous";

  return (
    <ul className="nav navbar-nav navbar-right user-menu">
      <li>
        <a href="/about">About</a>
      </li>
      <li className="dropdown">
        <a
          href="#"
          className="dropdown-toggle"
          data-toggle="dropdown"
          role="button"
          aria-haspopup="true"
          aria-expanded="false"
        >
          {title} <span className="caret" />
        </a>
        <MenuUserSettings
          favouriteChannel={favouriteChannel}
          setting={setting.map((v) => v.value).toJS()}
        />
      </li>
    </ul>
  );
}
