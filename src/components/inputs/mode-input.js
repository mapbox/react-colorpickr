'use strict';

var React = require('react');

function ModeInput({name, checked, onChange}) {
  return (
    <div>
      <input
        type='radio'
        name={name}
        checked={checked}
        onChange={onChange}
      />
    </div>
  );
}

ModeInput.propTypes = {
  name: React.PropTypes.string.isRequired,
  checked: React.PropTypes.bool.isRequired,
  onChange: React.PropTypes.func.isRequired
}

module.exports = ModeInput;
