'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import themeable from 'react-themeable';
import { autokey } from '../../autokey';

class ModeInput extends React.PureComponent {
  static propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    theme: PropTypes.object.isRequired,
    checked: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired
  };

  onChange = () => {
    const { onChange, id } = this.props;
    onChange(id);
  };

  render() {
    const theme = autokey(themeable(this.props.theme));
    const { name, checked } = this.props;

    return (
      <div {...theme('modeInputContainer')}>
        <input
          {...theme('modeInput')}
          type="radio"
          name={name}
          checked={checked}
          onChange={this.onChange}
        />
      </div>
    );
  }
}

export default ModeInput;
