'use strict';

var React = require('react');
var NumberInput = require('./number-input');

function SVAlphaInput(props) {
  return <NumberInput {...props} min={0} max={100} />
}

SVAlphaInput.propTypes = {
  label: React.PropTypes.string.isRequired,
  value: React.PropTypes.number.isRequired,
  onChange: React.PropTypes.func.isRequired
}

module.exports = SVAlphaInput;