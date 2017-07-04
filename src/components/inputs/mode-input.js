'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import themeable from 'react-themeable';

class ModeInput extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    theme: PropTypes.object.isRequired,
    checked: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired
  };

  render() {
    const theme = themeable(this.props.theme);
    const { name, checked, onChange } = this.props;

    return (
      <div {...theme(1, 'modeInputContainer')}>
        <input
          {...theme(2, 'modeInput')}
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
