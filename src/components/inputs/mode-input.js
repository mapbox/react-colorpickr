'use strict';

import React from 'react';
import PropTypes from 'prop-types';

class ModeInput extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    checked: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired
  };

  render() {
    const { name, checked, onChange } = this.props;
    return (
      <div className='flex-child flex-child--no-shrink w24 flex-parent flex-parent--center-cross'>
        <input className='cursor-pointer' type="radio" name={name} checked={checked} onChange={onChange} />
      </div>
    );
  }
}

export default ModeInput;
