'use strict';

var React = require('react');
var clamp = require('clamp');

module.exports = React.createClass({
  propTypes: {
    x: React.PropTypes.number.isRequired,
    y: React.PropTypes.number.isRequired,
    xmax: React.PropTypes.number.isRequired,
    ymax: React.PropTypes.number.isRequired,
    handleClass: React.PropTypes.string,
    onChange: React.PropTypes.func.isRequired
  },

  getInitialState() {
    return {
      dragging: false
    };
  },

  change(pos) {
    if (this.props.onChange) {
      var rect = this.getOwnBoundingRect();
      this.props.onChange({
        x: clamp(pos.left, 0, rect.width) / rect.width * this.props.xmax,
        y: clamp(pos.top, 0, rect.height) / rect.height * this.props.ymax
      });
    }
  },

  getOwnBoundingRect() {
    return React.findDOMNode(this).getBoundingClientRect();
  },

  _onMouseDown(e) {
    var rect = this.getOwnBoundingRect();
    var x = e.clientX,
      y = e.clientY;

    this.change({
      left: x - rect.left,
      top: y - rect.top
    });

    // Handle interaction
    this.start = {
      x: x - rect.left,
      y: y - rect.top
    };

    this.offset = { x, y };

    window.addEventListener('mousemove', this._drag);
    window.addEventListener('mouseup', this._dragEnd);
  },

  _drag(e) {
    this.setState({ dragging: true });
    var posX = e.clientX + this.start.x - this.offset.x;
    var posY = e.clientY + this.start.y - this.offset.y;

    this.change({
      left: posX,
      top: posY
    });
  },

  _dragEnd() {
    this.setState({ dragging: false });
    window.removeEventListener('mousemove', this._drag);
    window.removeEventListener('mouseup', this._dragEnd);
  },

  render() {
    return (
      <div
        onMouseDown={this._onMouseDown}
        className={`slider-xy ${this.state.dragging ? 'dragging-xy' : ''}`}>
        <div
          className={`handle-xy ${this.props.handleClass}`}
          style={{
            top: clamp(this.props.y / this.props.ymax * 100, 0, 100) + '%',
            left: clamp(this.props.x / this.props.xmax * 100, 0, 100) + '%'
          }} />
      </div>
    );
  }
});
