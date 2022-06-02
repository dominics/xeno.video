import MenuUser from './../../../../src/client/component/menu/MenuUser';
import React from 'react';

function sut(props) {
  return TestUtils.renderIntoDocument(
    <MenuUser {...props} />
  ).getDOMNode();
}

describe('client component UserMenu', () => {
  it('throws an error when given invalid props', () => {
    expect(() => {
      sut({});
    }).to.throw(Error);
  });
});
