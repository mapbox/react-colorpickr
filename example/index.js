var React = require('react');
var ColorPicker = require('../');

// Output fill that's outside of the react app.
var outputFill = document.getElementById('output-fill');

var App = React.createClass({
  getInitialState: function() {
    return {
      active: true,
      color: 'rgba(56, 130, 184, 1)'
    };
  },

  isDark: function(color) {
    return ((color.r * 0.299) + (color.g * 0.587) + (color.b * 0.114) > 186 ||
            color.a < 50) ?
            false :
            true;
  },

  outputFormat: function(c) {
    return "rgba(" + c.r + "," + c.g + "," + c.b + "," + (c.a / 100) + ")";
  },

  onChange: function(color) {
    outputFill.style.backgroundColor = this.outputFormat(color);

    if (this.isDark(color)) {
      outputFill.classList.add('dark');
    } else {
      outputFill.classList.remove('dark');
    }

    this.setState({
      color: this.outputFormat(color)
    });
  },

  render: function() {
    return (
      /* jshint ignore:start */
      <div>
        <div className='space-bottom2'>
          {this.state.active ? <ColorPicker
            value={this.state.color}
            onChange={this.onChange} /> : null}
        </div>
      </div>
      /* jshint ignore:end */
    );
  },

});

/* jshint ignore:start */
React.render(<App/>, document.getElementById('app'));
/* jshint ignore:end */
