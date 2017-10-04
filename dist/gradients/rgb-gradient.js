'use strict';

var React = require('react');
var PropTypes = require('prop-types');

function RGBGradient(_ref) {
  var color = _ref.color;
  var active = _ref.active;
  var opacityLow = _ref.opacityLow;
  var opacityHigh = _ref.opacityHigh;
  if (!active) {
    return React.createElement('noscript', null);
  }
  return React.createElement(
    'div',
    null,
    React.createElement('div', { className: 'cp-gradient cp-rgb cp-' + color + '-high', style: opacityHigh }),
    React.createElement('div', { className: 'cp-gradient cp-rgb cp-' + color + '-low', style: opacityLow })
  );
}

RGBGradient.propTypes = {
  color: React.PropTypes.string.isRequired,
  active: React.PropTypes.bool.isRequired,
  opacityLow: React.PropTypes.number.isRequired,
  opacityHigh: React.PropTypes.number.isRequired
};

module.exports = RGBGradient;
