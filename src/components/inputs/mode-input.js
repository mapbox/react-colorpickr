'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import themeable from 'react-themeable';
import { autokey } from '../../autokey';

class ModeInput extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    theme: PropTypes.object.isRequired,
    checked: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired
  };

  render() {
    const theme = autokey(themeable(this.props.theme));
    const { name, checked, onChange } = this.props;

    return (
      <div {...theme('modeInputContainer')}>
        <input
          {...theme('modeInput')}
          type="radio"
          name={name}
          checked={checked}
          onChange={onChange}
        />
      </div>
    );
  }
}

export default ModeInput;
