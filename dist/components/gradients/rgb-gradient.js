'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var RGBGradient = function (_React$Component) {
  _inherits(RGBGradient, _React$Component);

  function RGBGradient() {
    _classCallCheck(this, RGBGradient);

    return _possibleConstructorReturn(this, (RGBGradient.__proto__ || Object.getPrototypeOf(RGBGradient)).apply(this, arguments));
  }

  _createClass(RGBGradient, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          active = _props.active,
          color = _props.color,
          opacityLow = _props.opacityLow,
          opacityHigh = _props.opacityHigh;

      if (!active) return _react2.default.createElement('noscript', null);
      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement('div', { className: 'cp-gradient cp-rgb cp-' + color + '-high', style: opacityHigh }),
        _react2.default.createElement('div', { className: 'cp-gradient cp-rgb cp-' + color + '-low', style: opacityLow })
      );
    }
  }]);

  return RGBGradient;
}(_react2.default.Component);

RGBGradient.propTypes = {
  active: _propTypes2.default.bool.isRequired,
  color: _propTypes2.default.string.isRequired,
  opacityLow: _propTypes2.default.object.isRequired,
  opacityHigh: _propTypes2.default.object.isRequired
};
exports.default = RGBGradient;