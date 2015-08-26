'use strict';

var React = require('react');
var ColorPicker = require('../');

// Output fill that's outside of the react app.
var outputFill = document.getElementById('output-fill');

var App = React.createClass({
  getInitialState: function() {
    return {
      active: true,
      color: 'rgba(56,130,184,1)'
    };
  },

  isDark: function(color) {
    return ((color.r * 0.299) + (color.g * 0.587) + (color.b * 0.114) > 186 ||
            color.a < 0.50) ?
            false :
            true;
  },

  outputFormat: function(c) {
    return 'rgba(' + c.r + ',' + c.g + ',' + c.b + ',' + c.a + ')';
  },

  toggle: function() {
    this.setState({ active: !this.state.active});
  },

  onChange: function(color) {
    console.log('onChange: ', color);

    var output = this.outputFormat(color);
    outputFill.style.backgroundColor = output;

    if (this.isDark(color)) {
      outputFill.classList.add('dark');
    } else {
      outputFill.classList.remove('dark');
    }

    this.setState({
      color: output
    });
  },

  render: function() {
    return (
      <div>
        {this.state.active && <ColorPicker
          reset={true}
          value={this.state.color}
          onChange={this.onChange} />}
      </div>
    );
  }

});

React.render(<App/>, document.getElementById('app'));
