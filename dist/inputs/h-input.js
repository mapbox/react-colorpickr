'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require('react');
var PropTypes = require('prop-types');
var NumberInput = require('./number-input');

function HInput(props) {
  return React.createElement(NumberInput, _extends({}, props, { min: 0, max: 359 }));
}

HInput.propTypes = {
  label: React.PropTypes.string.isRequired,
  value: React.PropTypes.number.isRequired,
  onChange: React.PropTypes.func.isRequired
};

module.exports = HInput;
