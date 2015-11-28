import { default as React } from 'react';
import registry from './../../action';
import types from './../../action/types';

/**
 * @returns {XML}
 */
export default ({next, previous}) => {
  const nextHandler = next ? registry.getHandler(types.itemSelect).bind(undefined, next.id) : null;
  const previousHandler = previous ? registry.getHandler(types.itemSelect).bind(undefined, previous.id) : null;

  return (
    <nav>
      <a href="#" rel="next" className={'btn btn-default goto-next pull-right' + (nextHandler !== null ? '' : ' disabled')} onClick={nextHandler}>
        Next <span className="fa fa-arrow-right" />
      </a>

      <a href="#" rel="prev" className={'btn btn-default goto-prev pull-left' + (previousHandler !== null ? '' : ' disabled')} onClick={previousHandler}>
        <span className="fa fa-arrow-left" /> Previous
      </a>
    </nav>
  );
};
