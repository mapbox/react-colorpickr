var React = require('react');

module.exports = React.createClass({
  propTypes: {
    x: React.PropTypes.number.isRequired,
    y: React.PropTypes.number.isRequired,
    xmax: React.PropTypes.number.isRequired,
    ymax: React.PropTypes.number.isRequired,
    onChange: React.PropTypes.func.isRequired
  },

  getPosition: function() {
    var xmax = this.props.xmax;
    var ymax = this.props.ymax;
    var top = this.props.y / ymax * 100;
    var left = this.props.x / xmax * 100;

    if (top > 100) top = 100;
    if (top < 0) top = 0;
    if (this.props.axis === 'x') top = 0;
    top += '%';

    if (left > 100) left = 100;
    if (left < 0) left = 0;
    if (this.props.axis === 'y') left = 0;
    left += '%';

    return {
      top: top,
      left: left
    };
  },

  change: function(pos) {
    if (this.props.onChange) {
      var rect = this.getDOMNode().getBoundingClientRect();
      var width = rect.width;
      var height = rect.height;
      var left = pos.left;
      var top = pos.top;
      var axis = this.props.axis;

      if (left < 0) left = 0;
      if (left > width) left = width;
      if (top < 0) top = 0;
      if (top > height) top = height;

      this.props.onChange({
        x: left / width * this.props.xmax,
        y: top / height * this.props.ymax
      });
    }
  },

  _onMouseDown: function(e) {
    var rect = this.getDOMNode().getBoundingClientRect();
    var x = e.clientX,
      y = e.clientY;

    this.change({
      left: (x - rect.left),
      top: (y - rect.top)
    });

    // Handle interaction
    var el = this.refs.handle.getDOMNode();

    this.start = {
      x: (x - rect.left),
      y: (y - rect.top)
    };

    this.offset = { x: x, y: y };

    window.addEventListener('mousemove', this._drag);
    window.addEventListener('mouseup', this._dragEnd);
  },

  _drag: function(e) {
    var el = this.getDOMNode();
    el.classList.add('dragging');
    var rect = el.getBoundingClientRect();
    var posX = e.clientX + this.start.x - this.offset.x;
    var posY = e.clientY + this.start.y - this.offset.y;

    this.change({
      left: posX,
      top: posY
    });
  },

  _dragEnd: function(e) {
    var el = this.getDOMNode();
    el.classList.remove('dragging');
    window.removeEventListener('mousemove', this._drag);
    window.removeEventListener('mouseup', this._dragEnd);
  },

  render: function() {
    var pos = this.getPosition();
    return (
      /* jshint ignore:start */
      <div
        onMouseDown={this._onMouseDown}
        className={this.props.className}>
        <div
          className='handle'
          ref='handle'
          style={pos} />
      </div>
      /* jshint ignore:end */
    );
  }
});
