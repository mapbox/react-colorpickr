import React from 'react';
import PropTypes from 'prop-types';
import themeable from 'react-themeable';
import { autokey } from '../../autokey.ts';

function ModeInput({ theme, checked, onChange, readOnly }) {
  const themer = autokey(themeable(theme));
  return (
    <div {...themer('modeInputContainer')}>
      <input
        {...themer('modeInput')}
        type="radio"
        checked={checked}
        onChange={onChange}
        disabled={readOnly}
      />
    </div>
  );
}

ModeInput.defaultProps = {
  readOnly: false
};

ModeInput.propTypes = {
  name: PropTypes.string.isRequired,
  theme: PropTypes.object.isRequired,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  readOnly: PropTypes.bool
};

export { ModeInput };
