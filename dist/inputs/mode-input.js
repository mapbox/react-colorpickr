'use strict';

var React = require('react');

function ModeInput(_ref) {
  var checked = _ref.checked;
  var onChange = _ref.onChange;

  return React.createElement(
    'div',
    null,
    React.createElement('input', {
      type: 'radio',
      name: 'mode',
      checked: checked,
      onChange: onChange
    })
  );
}

ModeInput.propTypes = {
  checked: React.PropTypes.bool.isRequired,
  onChange: React.PropTypes.func.isRequired
};

module.exports = ModeInput;