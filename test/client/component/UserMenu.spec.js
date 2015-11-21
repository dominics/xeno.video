import UserMenu from './../../../dist/client/component/UserMenu';
import React from 'react';

function sut(props) {
  return TestUtils.renderIntoDocument(
    <UserMenu {...props} />
  ).getDOMNode();
}

describe('UserMenu component', () => {
  it('throws an error when given invalid props', () => {
    expect(() => {
      sut({});
    }).to.throw(Error);
  });
});
