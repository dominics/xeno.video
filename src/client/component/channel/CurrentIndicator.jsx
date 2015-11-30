import { default as React } from 'react';

export default (props) => {
  const {id} = props;

  return (
    <li className="channel active" id={'channel-' + id}>
      {id}
    </li>
  );
};
