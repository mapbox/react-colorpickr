'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import themeable from 'react-themeable';

class NumberInput extends React.Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    theme: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    min: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired
  };

  render() {
    const theme = themeable(this.props.theme);
    const { label, value, onChange, min, max } = this.props;
    return (
      <div {...theme(1, 'numberInputContainer')}>
        <label {...theme(2, 'numberInputLabel')}>{label}</label>
        <input
          {...theme(3, 'numberInput')}
          value={value}
          onChange={onChange}
          type="number"
          min={min}
          max={max}
          step={1}
        />
      </div>
    );
  }
}

export default NumberInput;
