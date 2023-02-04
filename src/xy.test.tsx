import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { XYControl } from './xy';

describe('XYControl', () => {
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
      <XYControl {...props}>
        <span>children</span>
      </XYControl>
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
      <XYControl {...isDarkProps}>
        <span>children</span>
      </XYControl>
    );
    expect(baseElement).toMatchSnapshot();
  });
});
