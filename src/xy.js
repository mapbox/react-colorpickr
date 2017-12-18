'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import themeable from 'react-themeable';
import clamp from 'clamp';

const isMobile = typeof document != 'undefined' && 'ontouchstart' in document;

class XYControl extends React.Component {
  _isMounted = false;

  static propTypes = {
    theme: PropTypes.object.isRequired,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    xmax: PropTypes.number.isRequired,
    ymax: PropTypes.number.isRequired,
    isDark: PropTypes.string,
    onChange: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  change(pos) {
    if (!this._isMounted) return;
    const rect = this.getOwnBoundingRect();
    this.props.onChange({
      x: clamp(pos.left, 0, rect.width) / rect.width * this.props.xmax,
      y: clamp(pos.top, 0, rect.height) / rect.height * this.props.ymax
    });
  }

  getOwnBoundingRect() {
    return ReactDOM.findDOMNode(this).getBoundingClientRect();
  }

  _dragStart = e => {
    e.preventDefault();
    if (!this._isMounted) return;
    const rect = this.getOwnBoundingRect();
    const x = isMobile ? e.changedTouches[0].clientX : e.clientX;
    const y = isMobile ? e.changedTouches[0].clientY : e.clientY;

    const offset = {
      left: x - rect.left,
      top: y - rect.top
    };

    this.change(offset);

    // Handle interaction
    this.setState({
      start: { x: offset.left, y: offset.top },
      offset: { x, y }
    });

    window.addEventListener(isMobile ? 'touchmove' : 'mousemove', this._drag);
    window.addEventListener(isMobile ? 'touchend' : 'mouseup', this._dragEnd);
  };

  _drag = e => {
    e.preventDefault();
    const posX =
      (isMobile ? e.changedTouches[0].clientX : e.clientX) +
      this.state.start.x -
      this.state.offset.x;
    const posY =
      (isMobile ? e.changedTouches[0].clientY : e.clientY) +
      this.state.start.y -
      this.state.offset.y;

    this.change({
      left: posX,
      top: posY
    });
  };

  _dragEnd = () => {
    window.removeEventListener(isMobile ? 'touchmove' : 'mousemove', this._drag);
    window.removeEventListener(isMobile ? 'touchend' : 'mouseup', this._dragEnd);
  };

  render() {
    const theme = themeable(this.props.theme);

    return (
      <div
        {...theme(1, 'xyControlContainer')}
        onTouchStart={this._dragStart}
        onMouseDown={this._dragStart}
      >
        <div
          {...theme(2, 'xyControl', `${this.props.isDark ? 'xyControlDark' : ''}`)}
          style={{
            top: clamp(this.props.y / this.props.ymax * 100, 0, 100) + '%',
            left: clamp(this.props.x / this.props.xmax * 100, 0, 100) + '%'
          }}
        />
      </div>
    );
  }
}

export default XYControl;
