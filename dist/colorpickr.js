'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _xy = require('./xy');

var _xy2 = _interopRequireDefault(_xy);

var _modeInput = require('./components/inputs/mode-input');

var _modeInput2 = _interopRequireDefault(_modeInput);

var _rgbInput = require('./components/inputs/rgb-input');

var _rgbInput2 = _interopRequireDefault(_rgbInput);

var _hInput = require('./components/inputs/h-input');

var _hInput2 = _interopRequireDefault(_hInput);

var _svAlphaInput = require('./components/inputs/sv-alpha-input');

var _svAlphaInput2 = _interopRequireDefault(_svAlphaInput);

var _rgbGradient = require('./components/gradients/rgb-gradient');

var _rgbGradient2 = _interopRequireDefault(_rgbGradient);

var _hGradient = require('./components/gradients/h-gradient');

var _hGradient2 = _interopRequireDefault(_hGradient);

var _svGradient = require('./components/gradients/sv-gradient');

var _svGradient2 = _interopRequireDefault(_svGradient);

var _tinycolor = require('tinycolor2');

var _tinycolor2 = _interopRequireDefault(_tinycolor);

var _reactThemeable = require('react-themeable');

var _reactThemeable2 = _interopRequireDefault(_reactThemeable);

var _colorfunc = require('./colorfunc');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var isRGBMode = function isRGBMode(c) {
  return c === 'r' || c === 'g' || c === 'b';
};
var isHSVMode = function isHSVMode(c) {
  return c === 'h' || c === 's' || c === 'v';
};

var defaultTheme = {
  container: 'colorpickr w240 inline-block bg-gray-faint round px12 py12 txt-xs',
  gradientContainer: 'z1 w-full h180 pr12 mb12 relative',
  controlsContainer: 'grid grid--gut12',
  controlsLeftContainer: 'col col--5',
  controlsRightContainer: 'col col--7',
  buttonModeContainer: 'grid mb12',
  buttonMode: 'col col--6 btn btn--gray-light h24 py0',
  buttonModeFirst: 'round-l',
  buttonModeLast: 'round-r',
  inputModeContainer: 'mt3 flex-parent',
  alphaContainer: 'mt3',
  tileBackground: 'bg-tile',
  active: 'is-active',
  colorModeSlider: 'colormode-slider',
  colorModeSliderR: 'colormode-slider-r',
  colorModeSliderG: 'colormode-slider-g',
  colorModeSliderB: 'colormode-slider-b',
  colorModeSliderH: 'colormode-slider-h',
  gradient: 'absolute top right bottom left',
  gradientLightLeft: 'gradient-light-left',
  gradientDarkBottom: 'gradient-dark-bottom',
  gradientLightBottom: 'gradient-light-bottom',
  gradientRHigh: 'gradient-rgb gradient-r-high',
  gradientRLow: 'gradient-rgb gradient-r-low',
  gradientGHigh: 'gradient-rgb gradient-g-high',
  gradientGLow: 'gradient-rgb gradient-g-low',
  gradientBHigh: 'gradient-rgb gradient-b-high',
  gradientBLow: 'gradient-rgb gradient-b-low',
  gradientSHigh: 'gradient-s-high',
  gradientSLow: 'gradient-s-low',
  gradientVHigh: 'gradient-v-high',
  gradientVLow: 'gradient-v-low',
  xyControlContainer: 'xy-control-container',
  xyControl: 'xy-control cursor-move',
  xyControlDark: 'xy-control-dark',
  numberInputContainer: 'flex-child flex-child--grow relative',
  numberInputLabel: 'absolute top left bottom pl6 flex-parent flex-parent--center-cross color-gray-light txt-bold',
  numberInput: 'w-full pl18 pr3 input input--s txt-mono txt-xs bg-white',
  modeInputContainer: 'flex-child flex-child--no-shrink flex-parent flex-parent--center-cross w24',
  modeInput: 'cursor-pointer',
  swatch: 'w-full h-full',
  swatchCompareContainer: 'grid h24 mb12',
  currentSwatchContainer: 'col col--6 round-l clip border-r border--gray-faint',
  currentSwatch: 'txt-bold align-center color-transparent color-white-on-hover transition',
  newSwatchContainer: 'col col--6 round-r clip',
  hexContainer: 'relative mb12 pb3'
};

var ColorPickr = function (_React$Component) {
  _inherits(ColorPickr, _React$Component);

  function ColorPickr(props) {
    _classCallCheck(this, ColorPickr);

    var _this = _possibleConstructorReturn(this, (ColorPickr.__proto__ || Object.getPrototypeOf(ColorPickr)).call(this, props));

    _initialiseProps.call(_this);

    var value = props.value,
        reset = props.reset,
        mode = props.mode,
        colorAttribute = props.colorAttribute;

    var modeInputName = !process.env.TESTING ? 'mode-' + Math.random() : '';
    _this.state = {
      originalValue: value,
      reset: reset,
      mode: mode,
      modeInputName: modeInputName,
      colorAttribute: colorAttribute,
      color: (0, _colorfunc.getColor)(value)
    };
    return _this;
  }

  _createClass(ColorPickr, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(props) {
      if (props.value) this.setState({ color: (0, _colorfunc.getColor)(props.value) });
    }
  }, {
    key: 'emitOnChange',
    value: function emitOnChange(change) {
      var _state = this.state,
          color = _state.color,
          mode = _state.mode,
          colorAttribute = _state.colorAttribute;

      this.props.onChange(_extends({}, color, { mode: mode }, { colorAttribute: colorAttribute }, change));
    }
  }, {
    key: '_onColorSliderChange',
    value: function _onColorSliderChange(mode, e) {
      var color = {};
      color[mode] = parseFloat(e.target.value);
      if (isRGBMode(mode)) this.changeRGB(color);
      if (isHSVMode(mode)) this.changeHSV(color);
    }
  }, {
    key: 'setColorAttribute',
    value: function setColorAttribute(attribute) {
      var _this2 = this;

      var obj = { colorAttribute: attribute };
      this.setState(obj, function () {
        _this2.emitOnChange(obj);
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var themeObject = _extends({}, defaultTheme, this.props.theme);
      var theme = (0, _reactThemeable2.default)(themeObject);

      var RGBGradientTheme = {
        gradient: themeObject.gradient,
        gradientRHigh: themeObject.gradientRHigh,
        gradientRLow: themeObject.gradientRLow,
        gradientGHigh: themeObject.gradientGHigh,
        gradientGLow: themeObject.gradientGLow,
        gradientBHigh: themeObject.gradientBHigh,
        gradientBLow: themeObject.gradientBlow
      };

      var HGradientTheme = {
        gradient: themeObject.gradient,
        gradientLightLeft: themeObject.gradientLightLeft,
        gradientDarkBottom: themeObject.gradientDarkBottom
      };

      var SVGradientTheme = {
        gradient: themeObject.gradient,
        gradientSHigh: themeObject.gradientSHigh,
        gradientSLow: themeObject.gradientSLow,
        gradientVHigh: themeObject.gradientVHigh,
        gradientVLow: themeObject.gradientVLow,
        gradientDarkBottom: themeObject.gradientDarkBottom,
        gradientLightBottom: themeObject.gradientLightBottom
      };

      var XYControlTheme = {
        xyControlContainer: themeObject.xyControlContainer,
        xyControl: themeObject.xyControl,
        xyControlDark: themeObject.xyControlDark
      };

      var numberInputTheme = {
        numberInputContainer: themeObject.numberInputContainer,
        numberInputLabel: themeObject.numberInputLabel,
        numberInput: themeObject.numberInput
      };

      var modeInputTheme = {
        modeInputContainer: themeObject.modeInputContainer,
        modeInput: themeObject.modeInput
      };

      var _state2 = this.state,
          colorAttribute = _state2.colorAttribute,
          color = _state2.color;
      var r = color.r,
          g = color.g,
          b = color.b,
          h = color.h,
          s = color.s,
          v = color.v,
          hex = color.hex;


      var a = Math.round(color.a * 100);

      var colorAttributeValue = color[colorAttribute];

      var colorAttributeMax = void 0;
      if (isRGBMode(colorAttribute)) {
        colorAttributeMax = 255;
      } else if (colorAttribute === 'h') {
        colorAttributeMax = 359;
      } else {
        colorAttributeMax = 100;
      }

      var rgbaBackground = (0, _colorfunc.rgbaColor)(r, g, b, a);
      var opacityGradient = 'linear-gradient(to right, ' + (0, _colorfunc.rgbaColor)(r, g, b, 0) + ', ' + (0, _colorfunc.rgbaColor)(r, g, b, 100) + ')';

      var hueBackground = '#' + (0, _colorfunc.hsv2hex)(h, 100, 100);
      var coords = (0, _colorfunc.colorCoords)(colorAttribute, color);

      // Slider background color for saturation & value.
      var hueSlide = {};
      if (colorAttribute === 'v') {
        hueSlide.background = 'linear-gradient(to left, ' + hueBackground + ' 0%, #000 100%)';
      } else if (colorAttribute === 's') {
        hueSlide.background = 'linear-gradient(to left, ' + hueBackground + ' 0%, #bbb 100%)';
      }

      // Opacity between colorspaces in RGB & SV
      var opacityHigh = {},
          opacityLow = {};
      if (['r', 'g', 'b'].indexOf(colorAttribute) >= 0) {
        opacityHigh.opacity = Math.round(color[colorAttribute] / 255 * 100) / 100;
        opacityLow.opacity = Math.round(100 - color[colorAttribute] / 255 * 100) / 100;
      } else if (['s', 'v'].indexOf(colorAttribute) >= 0) {
        opacityHigh.opacity = Math.round(color[colorAttribute] / 100 * 100) / 100;
        opacityLow.opacity = Math.round(100 - color[colorAttribute] / 100 * 100) / 100;
      }

      return _react2.default.createElement(
        'div',
        theme(1, 'container'),
        _react2.default.createElement(
          'div',
          theme(2, 'gradientContainer'),
          _react2.default.createElement(_rgbGradient2.default, {
            active: colorAttribute === 'r',
            theme: RGBGradientTheme,
            color: 'r',
            opacityLow: opacityLow,
            opacityHigh: opacityHigh
          }),
          _react2.default.createElement(_rgbGradient2.default, {
            active: colorAttribute === 'g',
            theme: RGBGradientTheme,
            color: 'g',
            opacityLow: opacityLow,
            opacityHigh: opacityHigh
          }),
          _react2.default.createElement(_rgbGradient2.default, {
            active: colorAttribute === 'b',
            theme: RGBGradientTheme,
            color: 'b',
            opacityLow: opacityLow,
            opacityHigh: opacityHigh
          }),
          _react2.default.createElement(_hGradient2.default, {
            theme: HGradientTheme,
            active: colorAttribute === 'h',
            hueBackground: hueBackground
          }),
          _react2.default.createElement(_svGradient2.default, {
            active: colorAttribute === 's',
            theme: SVGradientTheme,
            color: 's',
            opacityLow: opacityLow,
            opacityHigh: opacityHigh
          }),
          _react2.default.createElement(_svGradient2.default, {
            active: colorAttribute === 'v',
            theme: SVGradientTheme,
            color: 'v',
            opacityLow: opacityLow,
            opacityHigh: opacityHigh
          }),
          _react2.default.createElement(_xy2.default, _extends({}, coords, {
            isDark: (0, _colorfunc.isDark)([r, g, b, a]) ? '' : 'dark',
            theme: XYControlTheme,
            onChange: function onChange(e) {
              _this3._onXYChange(colorAttribute, e);
            }
          })),
          _react2.default.createElement(
            'div',
            theme(3, 'colorModeSlider', 'colorModeSlider' + colorAttribute.toUpperCase()),
            _react2.default.createElement('input', {
              type: 'range',
              value: colorAttributeValue,
              style: hueSlide,
              onChange: function onChange(e) {
                _this3._onColorSliderChange(colorAttribute, e);
              },
              min: 0,
              max: colorAttributeMax
            })
          )
        ),
        _react2.default.createElement(
          'div',
          theme(4, 'controlsContainer'),
          _react2.default.createElement(
            'div',
            theme(5, 'controlsLeftContainer'),
            _react2.default.createElement(
              'div',
              theme(6, 'buttonModeContainer'),
              _react2.default.createElement(
                'button',
                _extends({
                  'data-test': 'button-mode-rgb',
                  onClick: this.setMode
                }, theme(7, 'buttonMode', 'buttonModeFirst', '' + (this.state.mode === 'rgb' ? 'active' : '')), {
                  value: 'rgb'
                }),
                'RGB'
              ),
              _react2.default.createElement(
                'button',
                _extends({
                  'data-test': 'button-mode-hsv',
                  onClick: this.setMode
                }, theme(8, 'buttonMode', 'buttonModeLast', '' + (this.state.mode === 'hsv' ? 'active' : '')), {
                  value: 'hsv'
                }),
                'HSV'
              )
            ),
            this.state.mode === 'rgb' ? _react2.default.createElement(
              'div',
              null,
              _react2.default.createElement(
                'div',
                theme(9, 'inputModeContainer', '' + (colorAttribute === 'r' ? 'active' : '')),
                _react2.default.createElement(_modeInput2.default, {
                  theme: modeInputTheme,
                  name: this.state.modeInputName,
                  checked: colorAttribute === 'r',
                  onChange: function onChange() {
                    _this3.setColorAttribute('r');
                  }
                }),
                _react2.default.createElement(_rgbInput2.default, {
                  theme: numberInputTheme,
                  value: r,
                  onChange: function onChange(e) {
                    _this3.changeRGB('r', e);
                  },
                  label: 'R'
                })
              ),
              _react2.default.createElement(
                'div',
                theme(10, 'inputModeContainer', '' + (colorAttribute === 'g' ? 'active' : '')),
                _react2.default.createElement(_modeInput2.default, {
                  theme: modeInputTheme,
                  name: this.state.modeInputName,
                  checked: colorAttribute === 'g',
                  onChange: function onChange() {
                    _this3.setColorAttribute('g');
                  }
                }),
                _react2.default.createElement(_rgbInput2.default, {
                  value: g,
                  theme: numberInputTheme,
                  onChange: function onChange(e) {
                    _this3.changeRGB('g', e);
                  },
                  label: 'G'
                })
              ),
              _react2.default.createElement(
                'div',
                theme(11, 'inputModeContainer', '' + (colorAttribute === 'b' ? 'active' : '')),
                _react2.default.createElement(_modeInput2.default, {
                  theme: modeInputTheme,
                  name: this.state.modeInputName,
                  checked: colorAttribute === 'b',
                  onChange: function onChange() {
                    _this3.setColorAttribute('b');
                  }
                }),
                _react2.default.createElement(_rgbInput2.default, {
                  theme: numberInputTheme,
                  value: b,
                  onChange: function onChange(e) {
                    _this3.changeRGB('b', e);
                  },
                  label: 'B'
                })
              )
            ) : _react2.default.createElement(
              'div',
              null,
              _react2.default.createElement(
                'div',
                theme(12, 'inputModeContainer', '' + (colorAttribute === 'h' ? 'active' : '')),
                _react2.default.createElement(_modeInput2.default, {
                  name: this.state.modeInputName,
                  theme: modeInputTheme,
                  checked: colorAttribute === 'h',
                  onChange: function onChange() {
                    _this3.setColorAttribute('h');
                  }
                }),
                _react2.default.createElement(_hInput2.default, {
                  value: h,
                  theme: numberInputTheme,
                  onChange: function onChange(e) {
                    _this3.changeHSV('h', e);
                  },
                  label: 'H'
                })
              ),
              _react2.default.createElement(
                'div',
                theme(13, 'inputModeContainer', '' + (colorAttribute === 's' ? 'active' : '')),
                _react2.default.createElement(_modeInput2.default, {
                  name: this.state.modeInputName,
                  theme: modeInputTheme,
                  checked: colorAttribute === 's',
                  onChange: function onChange() {
                    _this3.setColorAttribute('s');
                  }
                }),
                _react2.default.createElement(_svAlphaInput2.default, {
                  value: s,
                  theme: numberInputTheme,
                  onChange: function onChange(e) {
                    _this3.changeHSV('s', e);
                  },
                  label: 'S'
                })
              ),
              _react2.default.createElement(
                'div',
                theme(14, 'inputModeContainer', '' + (colorAttribute === 'v' ? 'active' : '')),
                _react2.default.createElement(_modeInput2.default, {
                  name: this.state.modeInputName,
                  theme: modeInputTheme,
                  checked: colorAttribute === 'v',
                  onChange: function onChange() {
                    _this3.setColorAttribute('v');
                  }
                }),
                _react2.default.createElement(_svAlphaInput2.default, {
                  value: v,
                  theme: numberInputTheme,
                  onChange: function onChange(e) {
                    _this3.changeHSV('v', e);
                  },
                  label: 'V'
                })
              )
            )
          ),
          _react2.default.createElement(
            'div',
            theme(15, 'controlsRightContainer'),
            _react2.default.createElement(
              'div',
              theme(16, 'swatchCompareContainer'),
              this.state.reset && _react2.default.createElement(
                'div',
                theme(17, 'tileBackground', 'currentSwatchContainer'),
                _react2.default.createElement(
                  'button',
                  _extends({}, theme(18, 'swatch', 'currentSwatch'), {
                    title: 'Reset color',
                    style: { backgroundColor: this.state.originalValue },
                    onClick: this.reset
                  }),
                  'Reset'
                )
              ),
              _react2.default.createElement(
                'div',
                theme(19, 'tileBackground', 'newSwatchContainer'),
                _react2.default.createElement('div', _extends({}, theme(20, 'swatch'), { style: { backgroundColor: rgbaBackground } }))
              )
            ),
            _react2.default.createElement(
              'div',
              theme(21, 'hexContainer'),
              _react2.default.createElement(
                'label',
                theme(22, 'numberInputLabel'),
                '#'
              ),
              _react2.default.createElement('input', _extends({}, theme(23, 'numberInput'), {
                value: hex,
                onChange: this.changeHEX,
                type: 'text'
              }))
            ),
            _react2.default.createElement(
              'div',
              theme(24, 'tileBackground'),
              _react2.default.createElement('input', {
                type: 'range',
                value: a,
                onChange: this._onAlphaSliderChange,
                style: { background: opacityGradient },
                min: 0,
                max: 100
              })
            ),
            _react2.default.createElement(
              'div',
              theme(25, 'alphaContainer'),
              _react2.default.createElement(_svAlphaInput2.default, {
                value: a,
                theme: numberInputTheme,
                onChange: this.changeAlpha,
                label: String.fromCharCode(945)
              })
            )
          )
        )
      );
    }
  }]);

  return ColorPickr;
}(_react2.default.Component);

ColorPickr.propTypes = {
  onChange: _propTypes2.default.func.isRequired,
  colorAttribute: _propTypes2.default.string,
  theme: _propTypes2.default.object,
  mode: _propTypes2.default.string,
  value: _propTypes2.default.string,
  reset: _propTypes2.default.bool
};
ColorPickr.defaultProps = {
  value: '#4264fb',
  reset: true,
  mode: 'rgb',
  colorAttribute: 'h',
  theme: {}
};

var _initialiseProps = function _initialiseProps() {
  var _this4 = this;

  this.changeHSV = function (p, e) {
    var color = _this4.state.color;
    var j = p;
    if (typeof j === 'string') {
      j = {};
      j[p] = Math.floor(parseInt(e.target.value || 0, 10));
    }
    var h = 'h' in j ? j.h : color.h,
        s = 's' in j ? j.s : color.s,
        v = 'v' in j ? j.v : color.v;
    var rgb = (0, _colorfunc.hsv2rgb)(h, s, v);
    var hex = (0, _colorfunc.rgb2hex)(rgb.r, rgb.g, rgb.b);

    var changedColor = _extends({}, color, j, rgb, { hex: hex });

    _this4.setState({ color: changedColor }, function () {
      _this4.emitOnChange(changedColor);
    });
  };

  this.changeRGB = function (p, e) {
    var color = _this4.state.color;
    var j = p;
    if (typeof j === 'string') {
      j = {};
      j[p] = Math.floor(parseInt(e.target.value || 0, 10));
    }
    var r = 'r' in j ? j.r : color.r,
        g = 'g' in j ? j.g : color.g,
        b = 'b' in j ? j.b : color.b;
    var hsv = (0, _colorfunc.rgb2hsv)(r, g, b);

    var changedColor = _extends({}, color, j, hsv, {
      hex: (0, _colorfunc.rgb2hex)(r, g, b)
    });

    _this4.setState({ color: changedColor }, function () {
      _this4.emitOnChange(changedColor);
    });
  };

  this.changeAlpha = function (e) {
    var value = e.target.value || '0';
    if (value && typeof value === 'string') {
      var a = Math.floor(parseFloat(value));
      var color = _extends({}, _this4.state.color, { a: a / 100 });
      _this4.setState({ color: color }, function () {
        _this4.emitOnChange(color);
      });
    }
  };

  this.changeHEX = function (e) {
    var hex = '#' + e.target.value.trim();
    var isValid = (0, _tinycolor2.default)(hex).isValid();

    var color = (0, _colorfunc.getColor)(hex) || _this4.state.color;

    _this4.setState({
      color: isValid ? color : _extends({}, color, { hex: e.target.value.trim() })
    }, function () {
      if (isValid) _this4.emitOnChange({ input: 'hex' });
    });
  };

  this.reset = function () {
    _this4.setState({ color: (0, _colorfunc.getColor)(_this4.state.originalValue) }, _this4.emitOnChange);
  };

  this._onXYChange = function (mode, pos) {
    var color = (0, _colorfunc.colorCoordValue)(mode, pos);
    if (isRGBMode(mode)) _this4.changeRGB(color);
    if (isHSVMode(mode)) _this4.changeHSV(color);
  };

  this._onAlphaSliderChange = function (e) {
    _this4.changeHSV({
      a: Math.floor(parseFloat(e.target.value)) / 100
    });
  };

  this.setMode = function (e) {
    var obj = { mode: e.target.value };
    _this4.setState(obj, function () {
      _this4.emitOnChange(obj);
    });
  };
};

exports.default = ColorPickr;