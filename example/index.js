'use strict';

var React = require('react');
var ColorPicker = require('../src/colorpickr');

// Output fill that's outside of the react app.
var outputFill = document.getElementById('output-fill');

var App = React.createClass({
  isDark: function(color) {
    return ((color.r * 0.299) + (color.g * 0.587) + (color.b * 0.114) > 186 ||
            color.a < 0.50) ?
            false :
            true;
  },

  outputFormat: function(c) {
    return 'rgba(' + c.r + ',' + c.g + ',' + c.b + ',' + c.a + ')';
  },

  onChange: function(color) {
    var output = this.outputFormat(color);
    outputFill.style.backgroundColor = output;

    if (this.isDark(color)) {
      outputFill.classList.add('dark');
    } else {
      outputFill.classList.remove('dark');
    }
  },

  render: function() {
    return (
      <div>
        <ColorPicker onChange={this.onChange} />
      </div>
    );
  }

});

React.render(<App/>, document.getElementById('app'));
