'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactThemeable = require('react-themeable');

var _reactThemeable2 = _interopRequireDefault(_reactThemeable);

var _clamp = require('clamp');

var _clamp2 = _interopRequireDefault(_clamp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var isMobile = typeof document != 'undefined' && 'ontouchstart' in document;

var XYControl = function (_React$Component) {
  _inherits(XYControl, _React$Component);

  function XYControl(props) {
    _classCallCheck(this, XYControl);

    var _this = _possibleConstructorReturn(this, (XYControl.__proto__ || Object.getPrototypeOf(XYControl)).call(this, props));

    _this._dragStart = function (e) {
      e.preventDefault();
      var rect = _this.getOwnBoundingRect();
      var x = isMobile ? e.changedTouches[0].clientX : e.clientX;
      var y = isMobile ? e.changedTouches[0].clientY : e.clientY;

      var offset = {
        left: x - rect.left,
        top: y - rect.top
      };

      _this.change(offset);

      // Handle interaction
      _this.setState({
        start: { x: offset.left, y: offset.top },
        offset: { x: x, y: y }
      });

      window.addEventListener(isMobile ? 'touchmove' : 'mousemove', _this._drag);
      window.addEventListener(isMobile ? 'touchend' : 'mouseup', _this._dragEnd);
    };

    _this._drag = function (e) {
      e.preventDefault();
      var posX = (isMobile ? e.changedTouches[0].clientX : e.clientX) + _this.state.start.x - _this.state.offset.x;
      var posY = (isMobile ? e.changedTouches[0].clientY : e.clientY) + _this.state.start.y - _this.state.offset.y;

      _this.change({
        left: posX,
        top: posY
      });
    };

    _this._dragEnd = function () {
      window.removeEventListener(isMobile ? 'touchmove' : 'mousemove', _this._drag);
      window.removeEventListener(isMobile ? 'touchend' : 'mouseup', _this._dragEnd);
    };

    return _this;
  }

  _createClass(XYControl, [{
    key: 'change',
    value: function change(pos) {
      var rect = this.getOwnBoundingRect();
      this.props.onChange({
        x: (0, _clamp2.default)(pos.left, 0, rect.width) / rect.width * this.props.xmax,
        y: (0, _clamp2.default)(pos.top, 0, rect.height) / rect.height * this.props.ymax
      });
    }
  }, {
    key: 'getOwnBoundingRect',
    value: function getOwnBoundingRect() {
      return _reactDom2.default.findDOMNode(this).getBoundingClientRect();
    }
  }, {
    key: 'render',
    value: function render() {
      var theme = (0, _reactThemeable2.default)(this.props.theme);

      return _react2.default.createElement(
        'div',
        _extends({}, theme(1, 'xyControlContainer'), {
          onTouchStart: this._dragStart,
          onMouseDown: this._dragStart
        }),
        _react2.default.createElement('div', _extends({}, theme(2, 'xyControl', '' + (this.props.isDark ? 'xyControlDark' : '')), {
          style: {
            top: (0, _clamp2.default)(this.props.y / this.props.ymax * 100, 0, 100) + '%',
            left: (0, _clamp2.default)(this.props.x / this.props.xmax * 100, 0, 100) + '%'
          }
        }))
      );
    }
  }]);

  return XYControl;
}(_react2.default.Component);

XYControl.propTypes = {
  theme: _propTypes2.default.object.isRequired,
  x: _propTypes2.default.number.isRequired,
  y: _propTypes2.default.number.isRequired,
  xmax: _propTypes2.default.number.isRequired,
  ymax: _propTypes2.default.number.isRequired,
  isDark: _propTypes2.default.string,
  onChange: _propTypes2.default.func.isRequired
};
exports.default = XYControl;