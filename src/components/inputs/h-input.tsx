import React from 'react';
import { NumberInput } from './number-input.tsx';

function HInput(props) {
  return <NumberInput {...props} min={0} max={360} />;
}

export { HInput };
