import React, { useRef, ReactNode } from 'react';
import themeable from 'react-themeable';
import { autokey } from '../autokey';
import clamp from 'clamp';

interface Props {
  children: ReactNode;
  theme: { [id: string]: string };
  x: number;
  y: number;
  xmax: number;
  ymax: number;
  isDark: boolean;
  discRadius: number;
  onChange: ({ x, y }: { x: number; y: number }) => void;
  backgroundColor: string;
}

function XYInput({
  children,
  theme,
  x,
  y,
  xmax,
  ymax,
  isDark,
  discRadius,
  onChange,
  backgroundColor
}: Props) {
  const xyControlContainer = useRef(null);
  const coords = useRef({ start: { x: 0, y: 0 }, offset: { x: 0, y: 0 } });
  const themer = autokey(themeable(theme));
  const top = Math.round(clamp((y / ymax) * 100, 0, 100));
  const left = Math.round(clamp((x / xmax) * 100, 0, 100));

  const change = ({ top, left }: { top: number; left: number }) => {
    const { width, height } =
      xyControlContainer.current.getBoundingClientRect();

    onChange({
      x: (clamp(left, 0, width) / width) * xmax,
      y: (clamp(top, 0, height) / height) * ymax
    });
  };

  const dragEnd = (e: MouseEvent) => {
    e.preventDefault();
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('touchmove', drag, {
      passive: false
    } as unknown as EventListenerOptions);
    document.removeEventListener('mouseup', dragEnd);
    document.removeEventListener('touchend', dragEnd);
    document.removeEventListener('touchcancel', dragEnd);
  };

  const drag = (e: MouseEvent | TouchEvent) => {
    const { start, offset } = coords.current;
    e.preventDefault();

    let x: number;
    let y: number;

    if (e instanceof TouchEvent) {
      x = e.changedTouches[0].clientX;
      y = e.changedTouches[0].clientY;
    } else {
      x = e.clientX;
      y = e.clientY;
    }

    const top = y + start.y - offset.y;
    const left = x + start.x - offset.x;
    change({ top, left });
  };

  const dragStart = (e: MouseEvent | TouchEvent) => {
    e.preventDefault();

    const rect = xyControlContainer.current.getBoundingClientRect();
    let x: number;
    let y: number;

    if (e instanceof TouchEvent) {
      x = e.changedTouches[0].clientX;
      y = e.changedTouches[0].clientY;
    } else {
      x = e.clientX;
      y = e.clientY;
    }

    const offset = {
      left: x - rect.left,
      top: y - rect.top
    };

    change(offset);

    coords.current = {
      start: { x: offset.left, y: offset.top },
      offset: { x, y }
    };

    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);
    document.addEventListener('touchmove', drag, { passive: false });
    document.addEventListener('touchend', dragEnd);
    document.addEventListener('touchcancel', dragEnd);
  };

  return (
    <div
      {...themer('xyControlContainer')}
      data-testid="xy"
      ref={xyControlContainer}
      onTouchStart={dragStart}
      onMouseDown={dragStart}
    >
      <div
        {...themer('xyControl', `${isDark ? 'xyControlDark' : ''}`)}
        style={{
          backgroundColor,
          width: `${discRadius}px`,
          height: `${discRadius}px`,
          top: `calc(${top}% - ${discRadius / 2}px)`,
          left: `calc(${left}% - ${discRadius / 2}px)`
        }}
      />
      {children}
    </div>
  );
}

export { XYInput };
