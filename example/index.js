'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ColorPickr from '../src/colorpickr';

// Output fill that's outside of the react app.
const outputFill = document.getElementById('output-fill');
const INITIAL_VALUE = 'hsl(229, 96%, 62%)';
outputFill.style.backgroundColor = INITIAL_VALUE;

class App extends React.PureComponent {
  instance = null;

  constructor(props) {
    super(props); 
    this.state = {
      overrideValue: false
    };
  } 

  isDark(color) {
    const { r, g, b, a } = color;
    return ((r * 0.299) + (g * 0.587) + (b * 0.114) > 186 ||
            a < 0.50) ?
            false :
            true;
  }

  setInstance = picker => {
    this.instance = picker;
  }

  override = () => {
    this.instance.overrideValue('red');
  };

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
    const { overrideValue } = this.state;
    return (
      <div>
        <ColorPickr
          mounted={this.setInstance}
          initialValue={INITIAL_VALUE}
          onChange={this.onChange}
        />
        <button className="btn btn--xs btn--gray-light absolute top right mx12 my12" onClick={this.override}>
          override
        </button>
      </div>
    );
  }
}

ReactDOM.render(<App/>, document.getElementById('app'));
