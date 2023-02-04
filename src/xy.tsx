import React, { useRef, ReactNode } from 'react';
import themeable from 'react-themeable';
import { autokey } from './autokey.ts';
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
  onChange: ({ x: number, y: number }) => void;
}

function XYControl({
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
  const coords = useRef({ start: {}, offset: {}, cb: null });
  const top = Math.round(clamp((y / ymax) * 100, 0, 100));
  const left = Math.round(clamp((x / xmax) * 100, 0, 100));
  const themer = autokey(themeable(theme));

  const change = ({ top, left }: { top: number; left: number }) => {
    const { width, height } =
      xyControlContainer.current.getBoundingClientRect();

    onChange({
      x: (clamp(left, 0, width) / width) * xmax,
      y: (clamp(top, 0, height) / height) * ymax
    });
  };

  const dragEnd = (e) => {
    e.preventDefault();
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('touchmove', drag, { passive: false });
    document.removeEventListener('mouseup', dragEnd);
    document.removeEventListener('touchend', dragEnd);
    document.removeEventListener('touchcancel', dragEnd);
  };

  const drag = (e) => {
    const { start, offset } = coords.current;
    e.preventDefault();
    const top =
      (e.changedTouches ? e.changedTouches[0].clientY : e.clientY) +
      start.y -
      offset.y;
    const left =
      (e.changedTouches ? e.changedTouches[0].clientX : e.clientX) +
      start.x -
      offset.x;

    change({ top, left });
  };

  const dragStart = (e) => {
    e.preventDefault();

    const rect = xyControlContainer.current.getBoundingClientRect();
    const x = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
    const y = e.changedTouches ? e.changedTouches[0].clientY : e.clientY;

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
          top: `${top}%`,
          left: `${left}%`
        }}
      />
      {children}
    </div>
  );
}

export { XYControl };
