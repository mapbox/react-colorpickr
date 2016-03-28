'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require('react');

var XYControl = require('./xy');
var ModeInput = require('./components/inputs/mode-input');
var RGBInput = require('./components/inputs/rgb-input');
var HInput = require('./components/inputs/h-input');
var SVAlphaInput = require('./components/inputs/sv-alpha-input');
var RGBGradient = require('./components/gradients/rgb-gradient');
var HGradient = require('./components/gradients/h-gradient');
var SVGradient = require('./components/gradients/sv-gradient');
var tinyColor = require('tinycolor2');

var _require = require('./colorfunc');

var rgbaColor = _require.rgbaColor;
var rgb2hsv = _require.rgb2hsv;
var rgb2hex = _require.rgb2hex;
var hsv2hex = _require.hsv2hex;
var hsv2rgb = _require.hsv2rgb;
var colorCoords = _require.colorCoords;
var colorCoordValue = _require.colorCoordValue;
var getColor = _require.getColor;
var isDark = _require.isDark;


var isRGBMode = function isRGBMode(c) {
  return c === 'r' || c === 'g' || c === 'b';
};
var isHSVMode = function isHSVMode(c) {
  return c === 'h' || c === 's' || c === 'v';
};

module.exports = React.createClass({
  displayName: 'exports',


  propTypes: {
    onChange: React.PropTypes.func.isRequired,
    colorAttribute: React.PropTypes.string,
    mode: React.PropTypes.string,
    value: React.PropTypes.string,
    reset: React.PropTypes.bool
  },

  getInitialState: function getInitialState() {
    var _props = this.props;
    var value = _props.value;
    var reset = _props.reset;
    var mode = _props.mode;
    var colorAttribute = _props.colorAttribute;

    return {
      originalValue: value,
      reset: reset,
      mode: mode,
      colorAttribute: colorAttribute,
      color: getColor(value)
    };
  },
  getDefaultProps: function getDefaultProps() {
    return {
      value: '#3887be',
      reset: true,
      mode: 'rgb',
      colorAttribute: 'h'
    };
  },


  componentWillReceiveProps: function componentWillReceiveProps(props) {
    if (props.value) this.setState({ color: getColor(props.value) });
  },

  emitOnChange: function emitOnChange(change) {
    var _state = this.state;
    var color = _state.color;
    var mode = _state.mode;
    var colorAttribute = _state.colorAttribute;

    this.props.onChange(Object.assign({}, color, { mode: mode }, { colorAttribute: colorAttribute }, change));
  },
  changeHSV: function changeHSV(p, val) {
    var _this = this;

    var color = this.state.color;

    var j = p;
    if (typeof j === 'string') {
      j = {};
      j[p] = Math.floor(parseInt(val.target.value || 0, 10));
    }
    var h = 'h' in j ? j.h : color.h,
        s = 's' in j ? j.s : color.s,
        v = 'v' in j ? j.v : color.v;
    var rgb = hsv2rgb(h, s, v);
    var hex = rgb2hex(rgb.r, rgb.g, rgb.b);

    color = Object.assign({}, color, j, rgb, { hex: hex });

    this.setState({ color: color }, function () {
      _this.emitOnChange(color);
    });
  },
  changeRGB: function changeRGB(p, val) {
    var _this2 = this;

    var color = this.state.color;

    var j = p;
    if (typeof j === 'string') {
      j = {};
      j[p] = Math.floor(parseInt(val.target.value || 0, 10));
    }
    var r = 'r' in j ? j.r : color.r,
        g = 'g' in j ? j.g : color.g,
        b = 'b' in j ? j.b : color.b;
    var hsv = rgb2hsv(r, g, b);

    color = Object.assign({}, color, j, hsv, {
      hex: rgb2hex(r, g, b)
    });

    this.setState({ color: color }, function () {
      _this2.emitOnChange(color);
    });
  },
  changeAlpha: function changeAlpha(e) {
    var _this3 = this;

    var value = e.target.value || '0';
    if (value && typeof value === 'string') {
      var a = Math.floor(parseFloat(value));
      var color = Object.assign({}, this.state.color, { a: a / 100 });
      this.setState({ color: color }, function () {
        _this3.emitOnChange(color);
      });
    }
  },
  changeHEX: function changeHEX(e) {
    var _this4 = this;

    var hex = '#' + e.target.value.trim();
    var isValid = tinyColor(hex).isValid();

    var color = getColor(hex) || this.state.color;

    this.setState({
      color: isValid ? color : Object.assign({}, color, { hex: e.target.value.trim() })
    }, function () {
      if (isValid) _this4.emitOnChange({ input: 'hex' });
    });
  },
  reset: function reset() {
    this.setState({ color: getColor(this.state.originalValue) }, this.emitOnChange);
  },
  _onXYChange: function _onXYChange(mode, pos) {
    var color = colorCoordValue(mode, pos);
    if (isRGBMode(mode)) this.changeRGB(color);
    if (isHSVMode(mode)) this.changeHSV(color);
  },
  _onColorSliderChange: function _onColorSliderChange(mode, e) {
    var color = {};
    color[mode] = parseFloat(e.target.value);
    if (isRGBMode(mode)) this.changeRGB(color);
    if (isHSVMode(mode)) this.changeHSV(color);
  },
  _onAlphaSliderChange: function _onAlphaSliderChange(e) {
    this.changeHSV({
      a: Math.floor(parseFloat(e.target.value)) / 100
    });
  },
  setMode: function setMode(e) {
    var _this5 = this;

    var obj = { mode: e.target.value };
    this.setState(obj, function () {
      _this5.emitOnChange(obj);
    });
  },
  setColorAttribute: function setColorAttribute(attribute) {
    var _this6 = this;

    var obj = { colorAttribute: attribute };
    this.setState(obj, function () {
      _this6.emitOnChange(obj);
    });
  },
  render: function render() {
    var _state2 = this.state;
    var colorAttribute = _state2.colorAttribute;
    var color = _state2.color;
    var r = color.r;
    var g = color.g;
    var b = color.b;
    var h = color.h;
    var s = color.s;
    var v = color.v;
    var hex = color.hex;


    var a = Math.round(color.a * 100);

    var colorAttributeValue = color[colorAttribute];

    var colorAttributeMax;
    if (isRGBMode(colorAttribute)) {
      colorAttributeMax = 255;
    } else if (colorAttribute === 'h') {
      colorAttributeMax = 359;
    } else {
      colorAttributeMax = 100;
    }

    var rgbaBackground = rgbaColor(r, g, b, a);
    var opacityGradient = 'linear-gradient(to right, ' + rgbaColor(r, g, b, 0) + ', ' + rgbaColor(r, g, b, 100) + ')';

    var hueBackground = '#' + hsv2hex(h, 100, 100);
    var coords = colorCoords(colorAttribute, color);

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

    return React.createElement(
      'div',
      { className: 'colorpickr' },
      React.createElement(
        'div',
        { className: 'cp-body' },
        React.createElement(
          'div',
          { className: 'cp-col' },
          React.createElement(
            'div',
            { className: 'cp-selector' },
            React.createElement(RGBGradient, {
              active: colorAttribute === 'r',
              color: 'r',
              opacityLow: opacityLow,
              opacityHigh: opacityHigh
            }),
            React.createElement(RGBGradient, {
              active: colorAttribute === 'g',
              color: 'g',
              opacityLow: opacityLow,
              opacityHigh: opacityHigh
            }),
            React.createElement(RGBGradient, {
              active: colorAttribute === 'b',
              color: 'b',
              opacityLow: opacityLow,
              opacityHigh: opacityHigh
            }),
            React.createElement(HGradient, { active: colorAttribute === 'h', hueBackground: hueBackground }),
            React.createElement(SVGradient, {
              active: colorAttribute === 's',
              color: 's',
              opacityLow: opacityLow,
              opacityHigh: opacityHigh
            }),
            React.createElement(SVGradient, {
              active: colorAttribute === 'v',
              color: 'v',
              opacityLow: opacityLow,
              opacityHigh: opacityHigh
            }),
            React.createElement(XYControl, _extends({
              className: 'cp-slider-xy'
            }, coords, {
              handleClass: isDark([r, g, b, a]) ? '' : 'dark',
              onChange: this._onXYChange.bind(null, colorAttribute) }))
          ),
          React.createElement(
            'div',
            { className: 'cp-colormode-slider cp-colormode-attribute-slider ' + colorAttribute },
            React.createElement('input', {
              type: 'range',
              value: colorAttributeValue,
              style: hueSlide,
              onChange: this._onColorSliderChange.bind(null, colorAttribute),
              className: 'cp-colormode-slider-input',
              min: 0,
              max: colorAttributeMax })
          )
        ),
        React.createElement(
          'div',
          { className: 'cp-col' },
          React.createElement(
            'div',
            { className: 'cp-mode-tabs' },
            React.createElement(
              'button',
              {
                onClick: this.setMode,
                className: 'cp-mode-rgb ' + (this.state.mode === 'rgb' ? 'cp-active' : ''),
                value: 'rgb' },
              'RGB'
            ),
            React.createElement(
              'button',
              {
                className: 'cp-mode-hsv ' + (this.state.mode === 'hsv' ? 'cp-active' : ''),
                onClick: this.setMode,
                value: 'hsv' },
              'HSV'
            )
          ),
          React.createElement(
            'div',
            { className: 'cp-inputs' },
            this.state.mode === 'rgb' ? React.createElement(
              'div',
              null,
              React.createElement(
                'fieldset',
                { className: 'rgb-attribute-r ' + (colorAttribute === 'r' ? 'cp-active' : '') },
                React.createElement(ModeInput, {
                  checked: colorAttribute === 'r',
                  onChange: this.setColorAttribute.bind(null, 'r')
                }),
                React.createElement(RGBInput, {
                  value: r,
                  onChange: this.changeRGB.bind(null, 'r'),
                  label: 'R'
                })
              ),
              React.createElement(
                'fieldset',
                { className: 'rgb-attribute-g ' + (colorAttribute === 'g' ? 'cp-active' : '') },
                React.createElement(ModeInput, {
                  checked: colorAttribute === 'g',
                  onChange: this.setColorAttribute.bind(null, 'g')
                }),
                React.createElement(RGBInput, {
                  value: g,
                  onChange: this.changeRGB.bind(null, 'g'),
                  label: 'G'
                })
              ),
              React.createElement(
                'fieldset',
                { className: 'rgb-attribute-b ' + (colorAttribute === 'b' ? 'cp-active' : '') },
                React.createElement(ModeInput, {
                  checked: colorAttribute === 'b',
                  onChange: this.setColorAttribute.bind(null, 'b')
                }),
                React.createElement(RGBInput, {
                  value: b,
                  onChange: this.changeRGB.bind(null, 'b'),
                  label: 'B'
                })
              )
            ) : React.createElement(
              'div',
              null,
              React.createElement(
                'fieldset',
                { className: 'hsv-attribute-h ' + (colorAttribute === 'h' ? 'cp-active' : '') },
                React.createElement(ModeInput, {
                  checked: colorAttribute === 'h',
                  onChange: this.setColorAttribute.bind(null, 'h')
                }),
                React.createElement(HInput, {
                  value: h,
                  onChange: this.changeHSV.bind(null, 'h'),
                  label: 'H'
                })
              ),
              React.createElement(
                'fieldset',
                { className: 'hsv-attribute-s ' + (colorAttribute === 's' ? 'cp-active' : '') },
                React.createElement(ModeInput, {
                  checked: colorAttribute === 's',
                  onChange: this.setColorAttribute.bind(null, 's')
                }),
                React.createElement(SVAlphaInput, {
                  value: s,
                  onChange: this.changeHSV.bind(null, 's'),
                  label: 'S'
                })
              ),
              React.createElement(
                'fieldset',
                { className: 'hsv-attribute-v ' + (colorAttribute === 'v' ? 'cp-active' : '') },
                React.createElement(ModeInput, {
                  checked: colorAttribute === 'v',
                  onChange: this.setColorAttribute.bind(null, 'v')
                }),
                React.createElement(SVAlphaInput, {
                  value: v,
                  onChange: this.changeHSV.bind(null, 'v'),
                  label: 'V'
                })
              )
            ),
            React.createElement(
              'fieldset',
              { className: 'cp-relative' },
              React.createElement(SVAlphaInput, {
                value: a,
                onChange: this.changeAlpha,
                label: String.fromCharCode(945)
              })
            )
          ),
          React.createElement(
            'fieldset',
            { className: 'cp-fill-tile' },
            React.createElement('input', {
              type: 'range',
              className: 'cp-alpha-slider-input',
              value: a,
              onChange: this._onAlphaSliderChange,
              style: { background: opacityGradient },
              min: 0,
              max: 100 })
          )
        )
      ),
      React.createElement(
        'div',
        { className: 'cp-floor' },
        React.createElement(
          'div',
          { className: 'cp-actions cp-fl' },
          React.createElement(
            'span',
            { className: 'cp-fl cp-fill-tile' },
            React.createElement('div', {
              className: 'cp-swatch',
              style: { backgroundColor: rgbaBackground } })
          ),
          this.state.reset && React.createElement(
            'span',
            { className: 'cp-fl cp-fill-tile' },
            React.createElement('button', {
              className: 'cp-swatch cp-swatch-reset',
              title: 'Reset color',
              style: { backgroundColor: this.state.originalValue },
              onClick: this.reset })
          )
        ),
        React.createElement(
          'div',
          { className: 'cp-output cp-fr' },
          React.createElement(
            'fieldset',
            { className: 'cp-hex cp-relative cp-fr' },
            React.createElement(
              'label',
              null,
              '#'
            ),
            React.createElement('input', {
              value: hex,
              className: 'cp-hex-input',
              onChange: this.changeHEX,
              type: 'text' })
          )
        )
      )
    );
  }
});