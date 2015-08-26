'use strict';

var React = require('react');
var colorParser = require('csscolorparser').parseCSSColor;

var XYControl = require('./src/xy');

var { rgbaColor, rgb2hsv, rgb2hex, hsv2hex,
    hsv2rgb, colorCoords, colorCoordValue } = require('./src/colorfunc');

var isRGBMode = (c) => (c === 'r' || c === 'g' || c === 'b');
var isHSVMode = (c) => (c === 'h' || c === 's' || c === 'v');

module.exports = React.createClass({
  propTypes: {
    onChange: React.PropTypes.func.isRequired,
    colorAttribute: React.PropTypes.string,
    mode: React.PropTypes.string,
    value: React.PropTypes.string,
    reset: React.PropTypes.bool
  },

  getInitialState: function() {
    var color = (this.props.value) ? this.props.value : '#3887be';
    this.original = color;

    return {
      color: this.getColor(color),
      mode: this.props.mode ? this.props.mode : 'rgb',
      colorAttribute: this.props.colorAttribute ? this.props.colorAttribute : 'h'
    };
  },

  emitOnChange: function(change) {
    var { color, mode, colorAttribute } = this.state;
    this.props.onChange(Object.assign(
      color,
      { mode: mode },
      { colorAttribute: colorAttribute },
      change
    ));
  },

  changeHSV: function(p, val) {
    var { color } = this.state;
    var j = p;
    if (typeof j === 'string') {
      j = {};
      j[p] = Math.floor(parseInt(val.target.value, 10));
    }
    var rgb = hsv2rgb(j.h || color.h, j.s || color.s, j.v || color.v);
    var hex = rgb2hex(rgb.r, rgb.g, rgb.b);

    color = Object.assign(color, j, rgb, {hex: hex});

    this.setState({ color: color });
    this.emitOnChange(color);
  },

  changeRGB: function(p, val) {
    var { color } = this.state;
    var j = p;
    if (typeof j === 'string') {
      j = {};
      j[p] = Math.floor(parseInt(val.target.value, 10));
    }

    var hsv = rgb2hsv(j.r || color.r, j.g || color.g, j.b || color.b);

    color = Object.assign(color, j, hsv, {
      hex: rgb2hex(j.r || color.r, j.g || color.g, j.b || color.b)
    });

    this.setState({ color: color });
    this.emitOnChange(color);
  },

  changeAlpha: function(e) {
    var value = e.target.value || '0';
    if (value && typeof value === 'string') {
      var a = Math.floor(parseFloat(value));
      var color = Object.assign(this.state.color, { a: a / 100 });

      this.setState({ color: color });
      this.emitOnChange(color);
    }
  },

  changeHEX: function(e) {
    var hex = '#' + e.target.value.trim();
    var rgba = colorParser(hex);

    var color = this.getColor(hex) || this.state.color;

    if (rgba) {
      this.setState({ color: color });
    } else {
      this.setState({ color: Object.assign(color, {hex: e.target.value.trim()}) });
    }

    this.emitOnChange();
  },

  reset: function(e) {
    var obj = this.getColor(this.original);
    this.setState({ color: obj });
    this.emitOnChange(obj);
  },

  getColor: function(cssColor) {
    var rgba = colorParser(cssColor);
    if(rgba) {
      var r = rgba[0],
        g = rgba[1],
        b = rgba[2],
        a = rgba[3];

      var hsv = rgb2hsv(r, g, b);
      var hex = rgb2hex(r, g, b);

      // Convert to shorthand hex is applicable
      if (hex[0] === hex[1] &&
          hex[2] === hex[3] &&
          hex[4] === hex[5]) {
        hex = [hex[0], hex[2], hex[4]].join('');
      }

      return Object.assign(hsv, {
        r: r,
        g: g,
        b: b,
        a: a,
        hex: hex
      });
    }
    else {
      return null;
    }
  },

  _onXYChange: function(mode, pos) {
    var color = colorCoordValue(mode, pos);
    if (isRGBMode(mode)) this.changeRGB(color);
    if (isHSVMode(mode)) this.changeHSV(color);
  },

  _onColorSliderChange: function(mode, e) {
    var color = {};
    color[mode] = parseFloat(e.target.value);
    if (isRGBMode(mode)) this.changeRGB(color);
    if (isHSVMode(mode)) this.changeHSV(color);
  },

  _onAlphaSliderChange: function(e) {
    this.changeHSV({
      a: Math.floor(parseFloat(e.target.value)) / 100
    });
  },

  _onClick: function(e) {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
  },

  setMode: function(e) {
    var obj = { mode: e.target.value };
    this.setState(obj);
    this.emitOnChange(obj);
  },

  setColorAttribute: function(attribute) {
    var obj = { colorAttribute: attribute };
    this.setState(obj);
    this.emitOnChange(obj);
  },

  render: function () {
    var colorAttribute = this.state.colorAttribute;
    var color = this.state.color;
    var { r, g, b, h, s, v, hex } = color;

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
    var opacityGradient = 'linear-gradient(to right, ' +
      rgbaColor(r, g, b, 0) + ', ' +
      rgbaColor(r, g, b, 100) + ')';

    var hueBackground = '#' + hsv2hex(h, 100, 100);
    var coords = colorCoords(colorAttribute, color);

    var opacity = Math.round((coords.y / coords.ymax) * 100);

    // Slider background color for saturation & value.
    var hueSlide = {};
    if (colorAttribute === 'v') {
      hueSlide.background = 'linear-gradient(to left, ' + hueBackground + ' 0%, #000 100%)';
    } else if (colorAttribute === 's') {
      hueSlide.background = 'linear-gradient(to left, ' + hueBackground + ' 0%, #bbb 100%)';
    }

    // Opacity between colorspaces in RGB & SV
    var opacityHigh = {}, opacityLow = {};
    if (['r', 'g', 'b'].indexOf(colorAttribute) >= 0) {
      opacityHigh.opacity = Math.round((color[colorAttribute] / 255) * 100) / 100;
      opacityLow.opacity = Math.round(100 - ((color[colorAttribute] / 255) * 100)) / 100;
    } else if (['s', 'v'].indexOf(colorAttribute) >= 0) {
      opacityHigh.opacity = Math.round((color[colorAttribute] / 100) * 100) / 100;
      opacityLow.opacity = Math.round(100 - ((color[colorAttribute] / 100) * 100)) / 100;
    }

    // Determines display color of the XY control handle.
    var isdark = ((r * 0.299) + (g * 0.587) + (b * 0.114) > 186 || a < 0.50) ? '' : 'dark';

    return (
      <div className='colorpickr' onClick={this._onClick}>
        <div className='colorpickr-body'>
          <div className='col'>
            <div className='selector'>
              {(colorAttribute === 'r') &&
                <div>
                  <div className='gradient rgb r-high' style={opacityHigh} />
                  <div className='gradient rgb r-low' style={opacityLow} />
                </div>
              }
              {(colorAttribute === 'g') &&
                <div>
                  <div className='gradient rgb g-high' style={opacityHigh} />
                  <div className='gradient rgb g-low' style={opacityLow} />
                </div>
              }
              {(colorAttribute === 'b') &&
                <div>
                  <div className='gradient rgb b-high' style={opacityHigh} />
                  <div className='gradient rgb b-low' style={opacityLow} />
                </div>
              }
              {(colorAttribute === 'h') &&
                <div>
                  <div className='gradient' style={{backgroundColor: hueBackground}} />
                  <div className='gradient light-left' />
                  <div className='gradient dark-bottom' />
                </div>
              }
              {(colorAttribute === 's') &&
                <div>
                  <div className='gradient s-high' style={opacityHigh} />
                  <div className='gradient s-low' style={opacityLow} />
                  <div className='gradient dark-bottom' />
                </div>
              }
              {(colorAttribute === 'v') &&
                <div>
                  <div className='gradient v-high' style={opacityHigh} />
                  <div className='gradient light-bottom' style={opacityHigh} />
                  <div className='gradient v-low' style={opacityLow} />
                </div>
              }

              <XYControl
                className='slider-xy'
                x={coords.x}
                y={coords.y}
                xmax={coords.xmax}
                ymax={coords.ymax}
                handleClass={isdark}
                onChange={this._onXYChange.bind(null, colorAttribute)} />
            </div>
            <div className={`colormode-slider colormode-attribute-slider ${colorAttribute}`}>
              <input
                value={colorAttributeValue}
                style={hueSlide}
                onChange={this._onColorSliderChange.bind(null, colorAttribute)}
                type='range'
                min={0}
                max={colorAttributeMax} />
            </div>
          </div>

          <div className='col'>
            <div className='mode-tabs'>
              <button
                onClick={this.setMode}
                className={this.state.mode === 'rgb' && 'active'}
                value='rgb'>RGB
              </button>
              <button
                className={this.state.mode === 'hsv' && 'active'}
                onClick={this.setMode}
                value='hsv'>HSV
              </button>
            </div>

            <div className='inputs'>
              {(this.state.mode === 'rgb') ? (
              <div>
                <fieldset className={(colorAttribute === 'r') ? 'active' : ''}>
                  <label>R</label>
                  <input
                    value={r}
                    onFocus={this.setColorAttribute.bind(null, 'r')}
                    onChange={this.changeRGB.bind(null, 'r')}
                    type='number'
                    min={0}
                    max={255}
                    step={1} />
                </fieldset>
                <fieldset className={(colorAttribute === 'g') ? 'active' : ''}>
                  <label>G</label>
                  <input
                    value={g}
                    onFocus={this.setColorAttribute.bind(null, 'g')}
                    onChange={this.changeRGB.bind(null, 'g')}
                    type='number'
                    min={0}
                    max={255}
                    step={1} />
                </fieldset>
                <fieldset className={(colorAttribute === 'b') ? 'active' : ''}>
                  <label>B</label>
                  <input
                    value={b}
                    onFocus={this.setColorAttribute.bind(null, 'b')}
                    onChange={this.changeRGB.bind(null, 'b')}
                    type='number'
                    min={0}
                    max={255}
                    step={1} />
                </fieldset>
              </div>
              ) : (
              <div>
                <fieldset className={(colorAttribute === 'h') ? 'active' : ''}>
                  <label>H</label>
                  <input
                    value={h}
                    onFocus={this.setColorAttribute.bind(null, 'h')}
                    onChange={this.changeHSV.bind(null, 'h')}
                    type='number'
                    min={0}
                    max={359}
                    step={1} />
                </fieldset>
                <fieldset className={(colorAttribute === 's') ? 'active' : ''}>
                  <label>S</label>
                  <input
                    value={s}
                    onFocus={this.setColorAttribute.bind(null, 's')}
                    onChange={this.changeHSV.bind(null, 's')}
                    type='number'
                    min={0}
                    max={100}
                    step={1} />
                </fieldset>
                <fieldset className={(colorAttribute === 'v') ? 'active' : ''}>
                  <label>V</label>
                  <input
                    value={v}
                    onFocus={this.setColorAttribute.bind(null, 'v')}
                    onChange={this.changeHSV.bind(null, 'v')}
                    type='number'
                    min={0}
                    max={100}
                    step={1} />
                </fieldset>
              </div>
              )}

              <fieldset>
                <label className='label'>{String.fromCharCode(945)}</label>
                <input
                  value={a}
                  onChange={this.changeAlpha}
                  type='number'
                  min={0}
                  max={100}
                  step={1} />
              </fieldset>
            </div>
            <fieldset className='fill-tile'>
              <input
                className='opacity'
                value={a}
                onChange={this._onAlphaSliderChange}
                style={{background: opacityGradient}}
                type='range'
                min={0}
                max={100} />
            </fieldset>
          </div>
        </div>

        <div className='colorpickr-floor'>
          <div className='actions fl'>
            <span className='fl fill-tile'>
              <div
                className='swatch'
                style={{backgroundColor: rgbaBackground}}>
              </div>
            </span>
            {this.props.reset && <span className='fl fill-tile'>
              <button
                className='swatch'
                title='Reset color'
                style={{backgroundColor: this.original}}
                onClick={this.reset}>
              </button>
            </span>}
          </div>
          <div className='output fr'>
            <fieldset className='inline hex-input fr'>
              <label>#</label>
              <input
                value={hex}
                ref='hex'
                onChange={this.changeHEX}
                type='text' />
            </fieldset>
          </div>
        </div>
      </div>
    );
  }
});
