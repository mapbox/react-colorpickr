import React, { useRef } from 'react';
import ReactDOM from 'react-dom';
import ColorPickr from '../src/colorpickr';

// Output fill that's outside of the react app.
const outputFill = document.getElementById('output-fill');
const INITIAL_VALUE = 'hsla(229, 96%, 62%, 1)';
outputFill.style.backgroundColor = INITIAL_VALUE;

function App() {
  const instance = useRef(null);

  const isDark = color => {
    const { r, g, b, a } = color;
    return ((r * 0.299) + (g * 0.587) + (b * 0.114) > 186 ||
            a < 0.50) ?
            false :
            true;
  };

  const setInstance = picker => {
    instance.current = picker;
  }

  const override = () => {
    instance.current.overrideValue('red');
  };

  const onChange = color => {
    const { h, s, l, a } = color;
    outputFill.style.backgroundColor = `hsla(${h}, ${s}%, ${l}%, ${a})`;
    if (isDark(color)) {
      outputFill.classList.add('color-white');
      outputFill.classList.remove('color-gray-dark');
    } else {
      outputFill.classList.add('color-gray-dark');
      outputFill.classList.remove('color-white');
    }
  }

  return (
    <>
      <ColorPickr
        mounted={setInstance}
        initialValue={INITIAL_VALUE}
        onChange={onChange}
      />
      <button className="btn btn--xs btn--gray-light absolute top right mx12 my12" onClick={override}>
        override
      </button>
    </>
  );
}

ReactDOM.render(<App/>, document.getElementById('app'));
