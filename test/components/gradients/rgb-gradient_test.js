'use strict';

var React = require('react');
var RGBGradient = require('../../../src/components/gradients/rgb-gradient');
var shallow = require('enzyme').shallow;
var expect = require('expect');
var sinon = require('sinon');

describe('sv gradient component basics', (t) => {
  it('returns a no script tag if active === false', function() {
    const wrapper = shallow(<RGBGradient active={false} color='r' opacityLow={{}} opacityHigh={{}} />);
    expect(wrapper.contains(<noscript />)).toBe(true);
  });

  it('should render the gradient component with correct opacitys', function() {
    const wrapper = shallow(<RGBGradient active={true} color='r' opacityLow={{opacity: .5}} opacityHigh={{opacity: .6}} />);
    const containsGradient = wrapper.contains(
      <div>
        <div className='cp-gradient cp-rgb cp-r-high' style={{opacity: .6}} />
        <div className='cp-gradient cp-rgb cp-r-low' style={{opacity: .5}} />
      </div>
    );
    expect(containsGradient).toBe(true);
  });
});
