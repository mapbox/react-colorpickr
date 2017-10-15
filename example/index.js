'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ColorPickr from '../src/colorpickr';

// Output fill that's outside of the react app.
var outputFill = document.getElementById('output-fill');

// Set background to the default fill in react-colorpickr
outputFill.style.backgroundColor = '#4264fb';

class App extends React.PureComponent {
  isDark(color) {
    return ((color.r * 0.299) + (color.g * 0.587) + (color.b * 0.114) > 186 ||
            color.a < 0.50) ?
            false :
            true;
  }

  outputFormat(c) {
    return 'rgba(' + c.r + ',' + c.g + ',' + c.b + ',' + c.a + ')';
  }

  onChange = (color) => {
    const output = this.outputFormat(color);
    outputFill.style.backgroundColor = output;

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
      <ColorPickr onChange={this.onChange} />
    );
  }
}

ReactDOM.render(<App/>, document.getElementById('app'));
