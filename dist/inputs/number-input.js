'use strict';

var React = require('react');

function NumberInput(_ref) {
  var label = _ref.label;
  var value = _ref.value;
  var onChange = _ref.onChange;
  var min = _ref.min;
  var max = _ref.max;

  return React.createElement(
    'div',
    null,
    React.createElement(
      'label',
      null,
      label
    ),
    React.createElement('input', {
      value: value,
      onChange: onChange,
      type: 'number',
      min: 0,
      max: 255,
      step: 1
    })
  );
}

NumberInput.propTypes = {
  label: React.PropTypes.string.isRequired,
  value: React.PropTypes.number.isRequired,
  onChange: React.PropTypes.func.isRequired,
  min: React.PropTypes.number.isRequired,
  max: React.PropTypes.number.isRequired
};

module.exports = NumberInput;