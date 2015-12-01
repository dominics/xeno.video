import { default as React } from 'react';

export default (props) => {
  const {current} = props;

  return (
    <li className="channel active" id={'channel-' + current}>
      {current}
    </li>
  );
};
