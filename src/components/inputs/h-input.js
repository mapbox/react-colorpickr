'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import NumberInput from './number-input';

class HInput extends React.PureComponent {
  static propTypes = {
    id: PropTypes.string.isRequired,
    theme: PropTypes.object.isRequired,
    value: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
    readOnly: PropTypes.bool
  };

  render() {
    return <NumberInput {...this.props} min={0} max={360} />;
  }
}

export default HInput;
