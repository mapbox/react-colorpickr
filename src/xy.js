import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import themeable from 'react-themeable';
import { autokey } from './autokey';
import clamp from 'clamp';

function XYControl({ children, theme, x, y, xmax, ymax, isDark, onChange }) {
  const xyControlContainer = useRef(null);
  const mounted = useRef(false);
  const [coords, setCoords] = useState({ start: {}, offset: {}, cb: null });
  const top = Math.round(clamp((y / ymax) * 100, 0, 100));
  const left = Math.round(clamp((x / xmax) * 100, 0, 100));
  const themer = autokey(themeable(theme));

  useEffect(() => {
    mounted.current = true;
  }, []);

  useEffect(() => {
    if (coords.start.x) {
      window.addEventListener('mousemove', drag);
      window.addEventListener('mouseup', dragEnd);
      window.addEventListener('touchmove', drag);
      window.addEventListener('touchend', dragEnd);
    }
  }, [coords]);

  const change = (pos) => {
    if (!mounted) return;
    const rect = xyControlContainer.current.getBoundingClientRect();
    onChange({
      x: (clamp(pos.left, 0, rect.width) / rect.width) * xmax,
      y: (clamp(pos.top, 0, rect.height) / rect.height) * ymax
    });
  };

  const dragStart = (e) => {
    e.preventDefault();
    if (!mounted) return;
    const rect = xyControlContainer.current.getBoundingClientRect();
    const x = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
    const y = e.changedTouches ? e.changedTouches[0].clientY : e.clientY;

    const offset = {
      left: x - rect.left,
      top: y - rect.top
    };

    change(offset);

    setCoords({
      start: { x: offset.left, y: offset.top },
      offset: { x, y }
    });
  };

  const drag = (e) => {
    const { start, offset } = coords;
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

  const dragEnd = () => {
    window.removeEventListener('mousemove', drag);
    window.removeEventListener('mouseup', dragEnd);

    window.removeEventListener('touchmove', drag);
    window.removeEventListener('touchend', dragEnd);
  };

  return (
    <div
      {...themer('xyControlContainer')}
      ref={xyControlContainer}
      onTouchStart={dragStart}
      onMouseDown={dragStart}
    >
      <div
        {...themer('xyControl', `${isDark ? 'xyControlDark' : ''}`)}
        style={{
          top: `${top}%`,
          left: `${left}%`
        }}
      />
      {children}
    </div>
  );
}

XYControl.propTypes = {
  children: PropTypes.node.isRequired,
  theme: PropTypes.object.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  xmax: PropTypes.number.isRequired,
  ymax: PropTypes.number.isRequired,
  isDark: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired
};

export { XYControl };
