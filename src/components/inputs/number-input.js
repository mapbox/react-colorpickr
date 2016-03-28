'use strict';

var React = require('react');

function NumberInput({ label, value, onChange, min, max}) {
  return (
    <div>
     <label>{label}</label>
      <input
        value={value}
        onChange={onChange}
        type='number'
        min={0}
        max={255}
        step={1} 
      />
    </div>
  );
}

NumberInput.propTypes = {
  label: React.PropTypes.string.isRequired,
  value: React.PropTypes.number.isRequired,
  onChange: React.PropTypes.func.isRequired,
  min: React.PropTypes.number.isRequired,
  max: React.PropTypes.number.isRequired
}

module.exports = NumberInput;