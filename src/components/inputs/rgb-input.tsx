import React from 'react';
import { NumberInput } from './number-input.tsx';

function RGBInput(props) {
  return <NumberInput {...props} min={0} max={255} />;
}

export { RGBInput };
