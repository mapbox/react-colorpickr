import React, { CSSProperties } from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';

interface Props {
  onChange: (n: number) => void;
  colorValue: string;
  value: number;
  min: number;
  max: number;
  id: string;
  trackStyle: CSSProperties;
  disabled: boolean;
}

function SliderInput({
  onChange,
  disabled,
  colorValue,
  value,
  min,
  max,
  id,
  trackStyle
}: Props) {
  const rootProps = {
    id,
    name: id,
    onValueChange: (value: Array<number>) => onChange(value[0]),
    value: [value],
    min,
    max,
    disabled,
    className: 'relative flex h12 w-full round-full',
    style: {
      cursor: disabled ? 'default' : 'pointer',
      alignItems: 'center',
      touchAction: 'none'
    },
    'data-testid': `${id}-slider`
  };

  if (disabled) {
    rootProps.className = `${rootProps.className} opacity50`;
  }

  return (
    <SliderPrimitive.Root {...rootProps}>
      <div className="absolute w-full h3 bg-tile" />
      <SliderPrimitive.Track
        style={{ ...trackStyle }}
        className="h3 relative flex-child-grow round-full"
      />
      <SliderPrimitive.Thumb
        className="w12 h12 round-full block border border--white shadow-darken10"
        style={{
          cursor: disabled ? 'default' : 'ew-resize',
          backgroundColor: colorValue
        }}
      />
    </SliderPrimitive.Root>
  );
}

export { SliderInput };
