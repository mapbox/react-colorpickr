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
    onChange: jest.fn(),
    backgroundColor: '#fff'
  };

  beforeEach(() => {
    props.onChange.mockClear();
  });

  test('renders', () => {
    const { getByTestId, baseElement } = render(
      <XYInput {...props}>
        <span>children</span>
      </XYInput>
    );
    expect(baseElement).toMatchSnapshot();
    const xy = getByTestId('xy');

    fireEvent.pointerMove(xy, { clientX: 10, clientY: 10, buttons: 1 });
    expect(props.onChange).toHaveBeenCalledTimes(0);

    fireEvent.pointerDown(xy, { clientX: 0, clientY: 0, buttons: 1 });
    expect(props.onChange).toHaveBeenCalledTimes(1);
    fireEvent.pointerMove(xy, { clientX: 10, clientY: 10, buttons: 1 });
    expect(props.onChange).toHaveBeenCalledTimes(2);

    fireEvent.pointerUp(xy);
    fireEvent.pointerMove(xy, { clientX: 20, clientY: 20, buttons: 1 });
    expect(props.onChange).toHaveBeenCalledTimes(2);
  });

  test('captures the pointer so the drag survives leaving the document', () => {
    const { getByTestId } = render(
      <XYInput {...props}>
        <span>children</span>
      </XYInput>
    );
    const xy = getByTestId('xy');

    fireEvent.pointerDown(xy, { clientX: 0, clientY: 0, buttons: 1 });
    expect(xy.hasPointerCapture(1)).toBe(true);

    fireEvent.pointerUp(xy);
    expect(xy.hasPointerCapture(1)).toBe(false);
  });

  test('ends the drag when the pointer capture is lost', () => {
    const { getByTestId } = render(
      <XYInput {...props}>
        <span>children</span>
      </XYInput>
    );
    const xy = getByTestId('xy');

    fireEvent.pointerDown(xy, { clientX: 0, clientY: 0, buttons: 1 });
    fireEvent.pointerMove(xy, { clientX: 10, clientY: 10, buttons: 1 });
    expect(props.onChange).toHaveBeenCalledTimes(2);

    fireEvent.lostPointerCapture(xy);
    fireEvent.pointerMove(xy, { clientX: 20, clientY: 20, buttons: 1 });
    expect(props.onChange).toHaveBeenCalledTimes(2);
  });

  // Regression: a mouseup that happened somewhere we never saw it — over an
  // iframe, say — used to leave the drag live, so the disc followed the cursor
  // around the page with no button held.
  test('ends the drag if a move arrives with no button held', () => {
    const { getByTestId } = render(
      <XYInput {...props}>
        <span>children</span>
      </XYInput>
    );
    const xy = getByTestId('xy');

    fireEvent.pointerDown(xy, { clientX: 0, clientY: 0, buttons: 1 });
    expect(props.onChange).toHaveBeenCalledTimes(1);

    fireEvent.pointerMove(xy, { clientX: 10, clientY: 10, buttons: 0 });
    expect(props.onChange).toHaveBeenCalledTimes(1);

    fireEvent.pointerMove(xy, { clientX: 20, clientY: 20, buttons: 1 });
    expect(props.onChange).toHaveBeenCalledTimes(1);
  });

  test('ignores secondary buttons and additional pointers', () => {
    const { getByTestId } = render(
      <XYInput {...props}>
        <span>children</span>
      </XYInput>
    );
    const xy = getByTestId('xy');

    fireEvent.pointerDown(xy, {
      clientX: 0,
      clientY: 0,
      button: 2,
      buttons: 2
    });
    expect(props.onChange).toHaveBeenCalledTimes(0);

    fireEvent.pointerDown(xy, { clientX: 0, clientY: 0, buttons: 1 });
    expect(props.onChange).toHaveBeenCalledTimes(1);

    // A second pointer arriving mid-drag must not start or move anything.
    fireEvent.pointerDown(xy, {
      clientX: 5,
      clientY: 5,
      buttons: 1,
      pointerId: 2
    });
    fireEvent.pointerMove(xy, {
      clientX: 30,
      clientY: 30,
      buttons: 1,
      pointerId: 2
    });
    expect(props.onChange).toHaveBeenCalledTimes(1);
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
