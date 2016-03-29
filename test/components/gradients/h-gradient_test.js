'use strict';

var React = require('react');
var HGradient = require('../../../src/components/gradients/h-gradient');
var shallow = require('enzyme').shallow;
var expect = require('expect');
var sinon = require('sinon');

describe('h gradient component basics', (t) => {
  it('returns a no script tag if active === false', function() {
    const wrapper = shallow(<HGradient active={false} hueBackground='blue' />);
    expect(wrapper.contains(<noscript />)).toBe(true);
  });

  it('should render the gradient component with backgroundColor blue when active is true', function() {
    const wrapper = shallow(<HGradient active={true} hueBackground='blue' />);
    const containsGradient = wrapper.contains(
      <div>
        <div className='cp-gradient' style={{backgroundColor: 'blue'}} />
        <div className='cp-gradient cp-light-left' />
        <div className='cp-gradient cp-dark-bottom' />
      </div>
    );
    expect(containsGradient).toBe(true);
  });
});
