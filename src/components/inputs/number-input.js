import React from 'react';
import PropTypes from 'prop-types';
import themeable from 'react-themeable';
import { autokey } from '../../autokey';

function NumberInput({ id, value, theme, onChange, min, max, readOnly }) {
  const onInputChange = e => {
    let value = parseInt(e.target.value || 0, 10);

    // Don't exceed max value
    if (value > max) value = max;
    onChange(id, value);
  };

  const themer = autokey(themeable(theme));
  return (
    <div {...themer('numberInputContainer')}>
      <label {...themer('numberInputLabel')}>{id}</label>
      <input
        readOnly={readOnly}
        {...themer('numberInput')}
        value={value}
        onChange={onInputChange}
        type="number"
        min={min}
        max={max}
        step={1}
      />
    </div>
  );
}

NumberInput.propTypes = {
  id: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  theme: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  readOnly: PropTypes.bool
};

export { NumberInput };
