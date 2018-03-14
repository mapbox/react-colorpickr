'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ColorPickr from '../src/colorpickr';

// Output fill that's outside of the react app.
const outputFill = document.getElementById('output-fill');
const INITIAL_VALUE = 'hsl(229, 96%, 62%)';
outputFill.style.backgroundColor = INITIAL_VALUE;

class App extends React.PureComponent {
  isDark(color) {
    const { r, g, b, a } = color;
    return ((r * 0.299) + (g * 0.587) + (b * 0.114) > 186 ||
            a < 0.50) ?
            false :
            true;
  }

  onChange = color => {
    const { h, s, l, a } = color;
    outputFill.style.backgroundColor = `hsla(${h}, ${s}%, ${l}%, ${a})`;
    if (this.isDark(color)) {
      outputFill.classList.add('color-white');
      outputFill.classList.remove('color-gray-dark');
    } else {
      outputFill.classList.add('color-gray-dark');
      outputFill.classList.remove('color-white');
    }
  }

  render() {
    return (
      <ColorPickr initialValue={INITIAL_VALUE} onChange={this.onChange} />
    );
  }
}

ReactDOM.render(<App/>, document.getElementById('app'));
