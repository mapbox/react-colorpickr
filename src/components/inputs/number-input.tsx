import React, { useState, useCallback, useEffect } from 'react';
import themeable from 'react-themeable';
import { autokey } from '../../autokey.ts';

interface Props {
  id: string;
  value: number;
  theme: { [id: string]: string };
  onChange: (id: string, value: number) => void;
  min: number;
  max: number;
  readOnly?: boolean;
}

function NumberInput({
  id,
  value,
  theme,
  onChange,
  min,
  max,
  readOnly
}: Props) {
  const [internalValue, setInternalValue] = useState(value);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const onInputChange = useCallback(
    (e) => {
      setInternalValue(e.target.value);

      // Remove any leading zero and convert to number
      let nextValue = parseInt(e.target.value || 0, 10);

      // Don't exceed max value
      if (nextValue > max) nextValue = max;
      onChange(id, nextValue);
    },
    [id]
  );

  const themer = autokey(themeable(theme));
  return (
    <input
      id={id}
      readOnly={readOnly}
      {...themer('numberInput')}
      value={internalValue}
      onChange={onInputChange}
      type="number"
      min={min}
      max={max}
      step={1}
    />
  );
}

export { NumberInput };
