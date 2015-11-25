import { default as React } from 'react';

import Checkbox from './Checkbox';

export default function MenuUserSettings({setting}) {
  const options = [];

  if (!setting.authenticated) {
    options.push(<li key="login"><a href="/login">Login with Reddit</a></li>);
    options.push(<li key="login-separator" role="separator" className="divider" />);
  }

  options.push(<Checkbox key="autoplay" id="autoplay" checked={setting.autoplay} title="Autoplay" />);
  options.push(<Checkbox key="nsfw" id="nsfw" checked={setting.nsfw} title="Show NSFW" />);

  if (setting.authenticated) {
    options.push(<li key="logout-separator" role="separator" className="divider" />);
    options.push(<li key="logout"><a href="/logout">Logout</a></li>);
  }

  return (
    <ul className="dropdown-menu dropdown-menu-right">
      {options}
    </ul>
  );
};
