'use strict';

import React from 'react';
import PropTypes from 'prop-types';

class NumberInput extends React.Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
    min: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired
  };

  render() {
    const { label, value, onChange, min, max } = this.props;
    return (
      <div className='flex-child flex-child--grow relative'>
        <label className='absolute top left pl6 py3 color-gray-light txt-bold'>{label}</label>
        <input className='w-full pl18 input input--s bg-white' value={value} onChange={onChange} type="number" min={min} max={max} step={1} />
      </div>
    );
  }
}

export default NumberInput;
