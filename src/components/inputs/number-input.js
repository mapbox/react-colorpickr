'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import themeable from 'react-themeable';
import { autokey } from '../../autokey';

class NumberInput extends React.PureComponent {
  static propTypes = {
    id: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    theme: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    min: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired
  };

  onChange = (e) => {
    const { id, onChange, max } = this.props;
    let value = parseInt(e.target.value || 0, 10);

    // Don't exceed max value
    if (value > max) value = max;
    onChange(id, value);
  };

  render() {
    const theme = autokey(themeable(this.props.theme));
    const { id, value, min, max } = this.props;
    return (
      <div {...theme('numberInputContainer')}>
        <label {...theme('numberInputLabel')}>{id}</label>
        <input
          {...theme('numberInput')}
          value={value}
          onChange={this.onChange}
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
