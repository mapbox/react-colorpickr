import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { XYInput } from './xy-input';

describe('XYInput', () => {
  const props = {
    theme: {},
    x: 0,
    y: 10,
    xmax: 100,
    ymax: 100,
    isDark: false,
    discRadius: 18,
    onChange: jest.fn()
  };

  test('renders', () => {
    const { getByTestId, baseElement } = render(
      <XYInput {...props}>
        <span>children</span>
      </XYInput>
    );
    expect(baseElement).toMatchSnapshot();
    const xy = getByTestId('xy');

    fireEvent.mouseMove(xy, { clientX: 10, clientY: 10 });
    fireEvent.touchMove(xy, {
      changedTouches: [
        {
          clientX: 10,
          clientY: 10
        }
      ]
    });
    expect(props.onChange).toHaveBeenCalledTimes(0);

    fireEvent.mouseDown(xy, { clientX: 0, clientY: 0 });
    expect(props.onChange).toHaveBeenCalledTimes(1);
    fireEvent.touchStart(xy, {
      changedTouches: [
        {
          clientX: 0,
          clientY: 0
        }
      ]
    });
    expect(props.onChange).toHaveBeenCalledTimes(2);
    fireEvent.mouseMove(xy, { clientX: 10, clientY: 10 });
    expect(props.onChange).toHaveBeenCalledTimes(3);
    fireEvent.touchMove(xy, {
      changedTouches: [
        {
          clientX: 10,
          clientY: 10
        }
      ]
    });
    expect(props.onChange).toHaveBeenCalledTimes(4);

    fireEvent.mouseUp(xy);
    fireEvent.touchEnd(xy);
    fireEvent.mouseMove(xy, { clientX: 10, clientY: 10 });
    fireEvent.touchMove(xy, {
      changedTouches: [
        {
          clientX: 10,
          clientY: 10
        }
      ]
    });
    expect(props.onChange).toHaveBeenCalledTimes(4);
  });

  test('renders isDark', () => {
    const isDarkProps = {
      ...props,
      isDark: true
    };

    const { baseElement } = render(
      <XYInput {...isDarkProps}>
        <span>children</span>
      </XYInput>
    );
    expect(baseElement).toMatchSnapshot();
  });
});
