import React from 'react';
import { NumberInput } from './number-input.tsx';

function SLAlphaInput(props) {
  return <NumberInput {...props} min={0} max={100} />;
}

export { SLAlphaInput };
