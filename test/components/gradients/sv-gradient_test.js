'use strict';

var React = require('react');
var SVGradient = require('../../../src/components/gradients/sv-gradient');
var shallow = require('enzyme').shallow;
var expect = require('expect');
var sinon = require('sinon');

describe('sv gradient component basics', (t) => {
  it('returns a no script tag if active === false', function() {
    const wrapper = shallow(<SVGradient active={false} color='s' opacityLow={{}} opacityHigh={{}} />);
    expect(wrapper.contains(<noscript />)).toBe(true);
  });

  it('should render the gradient component with correct opacitys', function() {
    const wrapper = shallow(<SVGradient active={true} color='s' opacityLow={{opacity: .5}} opacityHigh={{opacity: .6}} />);
    const containsGradient = wrapper.contains(
      <div>
        <div className='cp-gradient cp-s-high' style={{opacity: .6}} />
        <div className='cp-gradient cp-s-low' style={{opacity: .5}}/>
        <div className='cp-gradient cp-dark-bottom' />
      </div>
    );
    expect(containsGradient).toBe(true);
  });
});
