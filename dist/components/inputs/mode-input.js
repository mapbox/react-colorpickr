'use strict';

var React = require('react');

function ModeInput(_ref) {
  var name = _ref.name;
  var checked = _ref.checked;
  var onChange = _ref.onChange;

  return React.createElement(
    'div',
    null,
    React.createElement('input', {
      type: 'radio',
      name: name,
      checked: checked,
      onChange: onChange
    })
  );
}

ModeInput.propTypes = {
  name: React.PropTypes.string.isRequired,
  checked: React.PropTypes.bool.isRequired,
  onChange: React.PropTypes.func.isRequired
};

module.exports = ModeInput;