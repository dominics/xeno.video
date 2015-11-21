import UserMenu from './../../../dist/client/component/UserMenu';

describe('UserMenu component', function() {

  before('render and locate element', () => {
    const renderedComponent = TestUtils.renderIntoDocument(
      <UserMenu done={false} name="Write Tutorial" />
    );

    const inputComponent = TestUtils.findRenderedDOMComponentWithTag(
      renderedComponent,
      'input'
    );

    this.inputElement = inputComponent.getDOMNode();
  });

  it('<input> should be of type "checkbox"', () => {
    expect(this.inputElement.getAttribute('type')).to.be.eql('checkbox');
  });
});
