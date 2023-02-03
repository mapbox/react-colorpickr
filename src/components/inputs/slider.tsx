import React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';

interface Props {
  colorValue: string;
  onChange: (n: number) => void;
  value: number;
  min: number;
  max: number;
  disabled: boolean;
}

function Slider({
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
    onValueChange: (value: Array<number>) => onChange(value),
    value: [value],
    min,
    max,
    disabled,
    className: 'relative flex h12 w-full',
    style: {
      alignItems: 'center',
      userSelect: 'none',
      touchAction: 'none'
    },
    'data-test': `${id}-slider`
  };

  return (
    <SliderPrimitive.Root {...rootProps}>
      <SliderPrimitive.Track
        style={{ ...trackStyle }}
        className="h3 bg-tile relative flex-child-grow round-full cursor-pointer"
      />
      <SliderPrimitive.Thumb
        className="w12 h12 round-full block"
        style={{
          cursor: `ew-resize`,
          backgroundColor: colorValue
        }}
      />
    </SliderPrimitive.Root>
  );
}

export { Slider };
