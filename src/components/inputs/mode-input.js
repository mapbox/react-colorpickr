import React from 'react';
import PropTypes from 'prop-types';
import themeable from 'react-themeable';
import { autokey } from '../../autokey';

function ModeInput({ id, name, theme, checked, onChange }) {
  const themer = autokey(themeable(theme));
  return (
    <div {...themer('modeInputContainer')}>
      <input
        {...themer('modeInput')}
        type="radio"
        name={name}
        checked={checked}
        onChange={() => onChange(id)}
      />
    </div>
  );
}

ModeInput.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  theme: PropTypes.object.isRequired,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired
};

export { ModeInput };
