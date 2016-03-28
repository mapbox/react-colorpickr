'use strict';

var React = require('react');
var NumberInput = require('./number-input');

function RGBInput(props) {
  return <NumberInput {...props} min={0} max={255} />
}

RGBInput.propTypes = {
  label: React.PropTypes.string.isRequired,
  value: React.PropTypes.number.isRequired,
  onChange: React.PropTypes.func.isRequired
}

module.exports = RGBInput;
