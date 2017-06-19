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

var HGradient = function (_React$Component) {
  _inherits(HGradient, _React$Component);

  function HGradient() {
    _classCallCheck(this, HGradient);

    return _possibleConstructorReturn(this, (HGradient.__proto__ || Object.getPrototypeOf(HGradient)).apply(this, arguments));
  }

  _createClass(HGradient, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          active = _props.active,
          hueBackground = _props.hueBackground;

      if (!active) return _react2.default.createElement('noscript', null);
      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement('div', { className: 'cp-gradient', style: { backgroundColor: hueBackground } }),
        _react2.default.createElement('div', { className: 'cp-gradient cp-light-left' }),
        _react2.default.createElement('div', { className: 'cp-gradient cp-dark-bottom' })
      );
    }
  }]);

  return HGradient;
}(_react2.default.Component);

HGradient.propTypes = {
  active: _propTypes2.default.bool.isRequired,
  hueBackground: _propTypes2.default.string.isRequired
};
exports.default = HGradient;