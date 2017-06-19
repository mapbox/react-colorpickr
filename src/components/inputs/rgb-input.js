'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import NumberInput from './number-input';

class RGBInput extends React.Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired
  };

  render() {
    return <NumberInput {...this.props} min={0} max={255} />;
  }
}

export default RGBInput;
