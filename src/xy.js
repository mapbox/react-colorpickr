'use strict';

var React = require('react');
var ReactDOM = require('react-dom');
var clamp = require('clamp');

var XYControl = React.createClass({
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
    var rect = this.getOwnBoundingRect();
    this.props.onChange({
      x: clamp(pos.left, 0, rect.width) / rect.width * this.props.xmax,
      y: clamp(pos.top, 0, rect.height) / rect.height * this.props.ymax
    });
  },
  getOwnBoundingRect() {
    return ReactDOM.findDOMNode(this).getBoundingClientRect();
  },
  _onMouseDown(e) {
    var rect = this.getOwnBoundingRect();
    var x = e.clientX,
      y = e.clientY;

    var offset = {
      left: x - rect.left,
      top: y - rect.top
    };

    this.change(offset);

    // Handle interaction
    this.setState({
      start: { x: offset.left, y: offset.top },
      offset: { x, y }
    });

    window.addEventListener('mousemove', this._drag);
    window.addEventListener('mouseup', this._dragEnd);
  },
  _drag(e) {
    this.setState({ dragging: true });
    var posX = e.clientX + this.state.start.x - this.state.offset.x;
    var posY = e.clientY + this.state.start.y - this.state.offset.y;

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

module.exports = XYControl;
