import React, { useState } from "react";
import PropTypes from "prop-types";
import themeable from "react-themeable";
import { autokey } from "../../autokey";

function NumberInput({ id, value, theme, onChange, min, max, readOnly }) {
  const [internalValue, setInternalValue] = useState(value);

  const onInputChange = (e) => {
    setInternalValue(e.target.value);

    // Remove any leading zero and convert to number
    let nextValue = parseInt(e.target.value || 0, 10);

    // Don't exceed max value
    if (nextValue > max) nextValue = max;
    onChange(id, nextValue);
  };

  const themer = autokey(themeable(theme));
  return (
    <div {...themer("numberInputContainer")}>
      <label htmlFor={id} {...themer("numberInputLabel")}>
        {id}
      </label>
      <input
        id={id}
        readOnly={readOnly}
        {...themer("numberInput")}
        value={internalValue}
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
  readOnly: PropTypes.bool,
};

export { NumberInput };
