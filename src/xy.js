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
      dragging: false,
      isMobile: false
    };
  },
  componentDidMount() {
    this.setState({
      isMobile: typeof document != 'undefined' && 'ontouchstart' in document
    });
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
  _dragStart(e) {
    e.preventDefault()
    var rect = this.getOwnBoundingRect();
    var x = this.state.isMobile ? e.changedTouches[0].clientX : e.clientX,
      y = this.state.isMobile ? e.changedTouches[0].clientY : e.clientY;

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

    window.addEventListener(this.state.isMobile ? 'touchmove' : 'mousemove', this._drag);
    window.addEventListener(this.state.isMobile ? 'touchend' : 'mouseup', this._dragEnd);
  },
  _drag(e) {
    e.preventDefault()
    this.setState({ dragging: true });
    var posX = (this.state.isMobile ? e.changedTouches[0].clientX : e.clientX) + this.state.start.x - this.state.offset.x;
    var posY = (this.state.isMobile ? e.changedTouches[0].clientY : e.clientY) + this.state.start.y - this.state.offset.y;

    this.change({
      left: posX,
      top: posY
    });
  },
  _dragEnd() {
    this.setState({ dragging: false });
    window.removeEventListener(this.state.isMobile ? 'touchmove' : 'mousemove', this._drag);
    window.removeEventListener(this.state.isMobile ? 'touchend' : 'mouseup', this._dragEnd);
  },
  render() {
    return (
      <div
        onTouchStart={this._dragStart}
        onMouseDown={this._dragStart}
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
