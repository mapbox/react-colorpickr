import React, { useRef, useEffect, ReactNode } from 'react';
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
  disabled?: boolean;
}

function XYInput({
  children,
  theme,
  x,
  y,
  xmax,
  ymax,
  isDark,
  disabled,
  discRadius,
  onChange,
  backgroundColor
}: Props) {
  const xyControlContainer = useRef<HTMLDivElement>(null);
  const coords = useRef({ start: { x: 0, y: 0 }, offset: { x: 0, y: 0 } });
  // The pointer currently driving a drag, so a second pointer (a stray finger,
  // a second mouse button) can't hijack it.
  const activePointerId = useRef<number | null>(null);
  const teardown = useRef<(() => void) | null>(null);

  // A drag can outlive the component if the picker unmounts mid-gesture.
  useEffect(() => () => teardown.current?.(), []);
  const themer = autokey(themeable(theme));
  const top = Math.round(clamp((y / ymax) * 100, 0, 100));
  const left = Math.round(clamp((x / xmax) * 100, 0, 100));

  const change = ({ top, left }: { top: number; left: number }) => {
    const container = xyControlContainer.current;
    if (!container) return;
    const { width, height } = container.getBoundingClientRect();

    onChange({
      x: (clamp(left, 0, width) / width) * xmax,
      y: (clamp(top, 0, height) / height) * ymax
    });
  };

  const stopDrag = () => {
    const container = xyControlContainer.current;
    const pointerId = activePointerId.current;
    if (pointerId === null) return;

    activePointerId.current = null;
    teardown.current = null;

    if (!container) return;
    container.removeEventListener('pointermove', drag);
    container.removeEventListener('pointerup', dragEnd);
    container.removeEventListener('pointercancel', dragEnd);
    container.removeEventListener('lostpointercapture', dragEnd);

    if (container.hasPointerCapture(pointerId)) {
      container.releasePointerCapture(pointerId);
    }
  };

  const dragEnd = (e: PointerEvent) => {
    if (e.pointerId !== activePointerId.current) return;
    e.preventDefault();
    stopDrag();
  };

  const drag = (e: PointerEvent) => {
    if (e.pointerId !== activePointerId.current) return;
    e.preventDefault();

    // Defensive: if the button was released somewhere we never saw the event
    // (a nested iframe, outside the window), don't keep following the cursor.
    if (e.pointerType === 'mouse' && e.buttons === 0) {
      stopDrag();
      return;
    }

    const { start, offset } = coords.current;
    const top = e.clientY + start.y - offset.y;
    const left = e.clientX + start.x - offset.x;
    change({ top, left });
  };

  const dragStart = (e: React.PointerEvent) => {
    // Ignore secondary buttons and additional pointers during a drag.
    if (activePointerId.current !== null || e.button !== 0) return;
    e.preventDefault();

    const container = xyControlContainer.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const offset = {
      left: e.clientX - rect.left,
      top: e.clientY - rect.top
    };

    change(offset);

    coords.current = {
      start: { x: offset.left, y: offset.top },
      offset: { x: e.clientX, y: e.clientY }
    };

    activePointerId.current = e.pointerId;
    teardown.current = stopDrag;

    // Capturing the pointer retargets every subsequent event for it to this
    // element, so the gesture survives passing over an iframe — including the
    // pointerup that ends it, which a document-level listener would never see.
    container.setPointerCapture(e.pointerId);
    container.addEventListener('pointermove', drag);
    container.addEventListener('pointerup', dragEnd);
    container.addEventListener('pointercancel', dragEnd);
    container.addEventListener('lostpointercapture', dragEnd);
  };

  const themeKeys = ['xyControl'];
  if (isDark) {
    themeKeys.push('xyControlDark');
  }

  if (disabled) {
    themeKeys.push('xyControlDisabled');
  }

  return (
    <div
      {...themer('xyControlContainer')}
      data-testid="xy"
      ref={xyControlContainer}
      style={{ touchAction: 'none' }}
      onPointerDown={dragStart}
    >
      <div
        {...themer(...themeKeys)}
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
