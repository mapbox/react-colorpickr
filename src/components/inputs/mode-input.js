'use strict';

var React = require('react');

function ModeInput({checked, onChange}) {
  return (
    <div>
      <input
        type='radio'
        name='mode'
        checked={checked}
        onChange={onChange}
      />
    </div>
  );
}

ModeInput.propTypes = {
  checked: React.PropTypes.bool.isRequired,
  onChange: React.PropTypes.func.isRequired,
}

module.exports = ModeInput;
