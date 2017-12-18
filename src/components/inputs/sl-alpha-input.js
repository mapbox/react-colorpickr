'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import NumberInput from './number-input';

class SLAlphaInput extends React.Component {
  static propTypes = {
    theme: PropTypes.object.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired
  };

  render() {
    return <NumberInput {...this.props} min={0} max={100} />;
  }
}

export default SLAlphaInput;
