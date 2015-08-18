'use strict';

var React = require('react');
var colorParser = require('csscolorparser').parseCSSColor;
var ls = require('local-storage');
var extend = require('xtend');

var XYControl = require('./src/xy');

var { rgbaColor, rgb2hsv, rgb2hex, hsv2hex,
    hsv2rgb, colorCoords, colorCoordValue } = require('./src/colorfunc');

var isRGBMode = (c) => (c === 'r' || c === 'g' || c === 'b');
var isHSVMode = (c) => (c === 'h' || c === 's' || c === 'v');

module.exports = React.createClass({
  propTypes: {
    onChange: React.PropTypes.func.isRequired,
    value: React.PropTypes.string,
    reset: React.PropTypes.bool
  },

  getInitialState: function() {
    var color = (this.props.value) ? this.props.value : '#3887be';
    this.original = color;

    return {
      color: this.getColor(color),
      mode: ls.get('mode') ? ls.get('mode') : 'rgb',
      colorMode: ls.get('colorMode') ? ls.get('colorMode') : 'h'
    };
  },

  changeHSV: function(p, val) {
    var j = p;
    if (typeof j === 'string') {
      j = {};
      j[p] = Math.floor(parseInt(val.target.value, 10));
    }
    var color = this.state.color;
    var rgb = hsv2rgb(j.h || color.h, j.s || color.s, j.v || color.v);
    var hex = rgb2hex(rgb.r, rgb.g, rgb.b);

    color = extend(color, j, rgb, {hex: hex});

    this.props.onChange(color);
    this.setState({
      color: color
    });
  },

  changeRGB: function(p, val) {
    var j = p;
    if (typeof j === 'string') {
      j = {};
      j[p] = Math.floor(parseInt(val.target.value, 10));
    }

    var color = this.state.color;
    var hsv = rgb2hsv(j.r || color.r, j.g || color.g, j.b || color.b);

    color = extend(color, j, hsv, {
      hex: rgb2hex(j.r || color.r, j.g || color.g, j.b || color.b)
    });

    this.props.onChange(color);
    this.setState({
      color: color
    });
  },

  changeAlpha: function(e) {
    var value = e.target.value || '0';
    if (value && typeof value === 'string') {
      var a = Math.floor(parseFloat(value));
      this.props.onChange(extend(this.state.color, {a: a / 100}));
      this.setState({
       color: extend(this.state.color, {a: a})
      });
    }
  },

  changeHEX: function(e) {
    var hex = '#' + e.target.value.trim();
    var rgba = colorParser(hex);

    var color = this.getColor(hex) || this.state.color;

    if (rgba) {
      this.props.onChange(color);
      this.setState({
        color: color
      });
    }
    else {
      this.setState({
        color: extend(color, {hex: e.target.value.trim()})
      });
    }
  },

  reset: function(e) {
    this.setState({
      color: this.getColor(this.original)
    });

    this.props.onChange(this.getColor(this.original));
  },

  getColor: function(cssColor) {
    var rgba = colorParser(cssColor);
    if(rgba) {
      var r = rgba[0],
        g = rgba[1],
        b = rgba[2],
        a = rgba[3] * 100;

      var hsv = rgb2hsv(r, g, b);
      var hex = rgb2hex(r, g, b);

      // Convert to shorthand hex is applicable
      if (hex[0] === hex[1] &&
          hex[2] === hex[3] &&
          hex[4] === hex[5]) {
        hex = [hex[0], hex[2], hex[4]].join('');
      }

      return extend(hsv, {
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
    color[mode] = e.target.value;
    if (isRGBMode(mode)) this.changeRGB(color);
    if (isHSVMode(mode)) this.changeHSV(color);
  },

  _onAlphaSliderChange: function(e) {
    this.changeHSV({
      a: Math.floor(e.target.value)
    });
  },

  _onClick: function(e) {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
  },

  colorMode: function(mode) {
    ls.set('colorMode', mode);
    this.setState({colorMode: mode});
  },

  setMode: function(e) {
    ls.set('mode', e.target.value);
    this.setState({mode: e.target.value});
  },

  render: function () {
    var colorMode = this.state.colorMode;
    var color = this.state.color;
    var { r, g, b, h, s, v, hex } = color;

    var a = Math.round(color.a);

    var colorModeValue = color[colorMode];

    var colorModeMax;
    if (isRGBMode(colorMode)) {
      colorModeMax = 255;
    } else if (colorMode === 'h') {
      colorModeMax = 359;
    } else {
      colorModeMax = 100;
    }

    var rgbaBackground = rgbaColor(r, g, b, a);
    var opacityGradient = 'linear-gradient(to right, ' +
      rgbaColor(r, g, b, 0) + ', ' +
      rgbaColor(r, g, b, 100) + ')';

    var hueBackground = '#' + hsv2hex(h, 100, 100);
    var coords = colorCoords(colorMode, color);

    var opacity = Math.round((coords.y / coords.ymax) * 100);

    // Slider background color for saturation & value.
    var hueSlide = {};
    if (colorMode === 'v') {
      hueSlide.background = 'linear-gradient(to left, ' + hueBackground + ' 0%, #000 100%)';
    } else if (colorMode === 's') {
      hueSlide.background = 'linear-gradient(to left, ' + hueBackground + ' 0%, #bbb 100%)';
    }

    // Opacity between colorspaces in RGB & SV
    var opacityHigh = {}, opacityLow = {};
    if (['r', 'g', 'b'].indexOf(colorMode) >= 0) {
      opacityHigh.opacity = Math.round((color[colorMode] / 255) * 100) / 100;
      opacityLow.opacity = Math.round(100 - ((color[colorMode] / 255) * 100)) / 100;
    } else if (['s', 'v'].indexOf(colorMode) >= 0) {
      opacityHigh.opacity = Math.round((color[colorMode] / 100) * 100) / 100;
      opacityLow.opacity = Math.round(100 - ((color[colorMode] / 100) * 100)) / 100;
    }

    return (
      <div className='colorpickr' onClick={this._onClick}>
        <div className='colorpickr-body'>
          <div className='col'>
            <div className='selector'>
              {(colorMode === 'r') &&
                <div>
                  <div className='gradient rgb r-high' style={opacityHigh} />
                  <div className='gradient rgb r-low' style={opacityLow} />
                </div>
              }
              {(colorMode === 'g') &&
                <div>
                  <div className='gradient rgb g-high' style={opacityHigh} />
                  <div className='gradient rgb g-low' style={opacityLow} />
                </div>
              }
              {(colorMode === 'b') &&
                <div>
                  <div className='gradient rgb b-high' style={opacityHigh} />
                  <div className='gradient rgb b-low' style={opacityLow} />
                </div>
              }
              {(colorMode === 'h') &&
                <div>
                  <div className='gradient' style={{backgroundColor: hueBackground}} />
                  <div className='gradient light-left' />
                  <div className='gradient dark-bottom' />
                </div>
              }
              {(colorMode === 's') &&
                <div>
                  <div className='gradient s-high' style={opacityHigh} />
                  <div className='gradient s-low' style={opacityLow} />
                  <div className='gradient dark-bottom' />
                </div>
              }
              {(colorMode === 'v') &&
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
                onChange={this._onXYChange.bind(null, colorMode)} />
            </div>
            <div className={`colormode-slider ${colorMode}`}>
              <input
                value={colorModeValue}
                style={hueSlide}
                onChange={this._onColorSliderChange.bind(null, colorMode)}
                type='range'
                min={0}
                max={colorModeMax} />
            </div>
          </div>

          <div className='col'>
            <div className='mode-tabs'>
              <button
                onClick={this.setMode}
                className={this.state.mode === 'rgb' && 'active'}
                type="button"
                value='rgb'>RGB
              </button>
              <button
                className={this.state.mode === 'hsv' && 'active'}
                onClick={this.setMode}
                type="button"
                value='hsv'>HSV
              </button>
            </div>

            <div className='inputs'>
              {(this.state.mode === 'rgb') ? (
              <div>
                <fieldset className={(colorMode === 'r') ? 'active' : ''}>
                  <label>R</label>
                  <input
                    value={r}
                    onFocus={this.colorMode.bind(null, 'r')}
                    onChange={this.changeRGB.bind(null, 'r')}
                    type='number'
                    min={0}
                    max={255}
                    step={1} />
                </fieldset>
                <fieldset className={(colorMode === 'g') ? 'active' : ''}>
                  <label>G</label>
                  <input
                    value={g}
                    onFocus={this.colorMode.bind(null, 'g')}
                    onChange={this.changeRGB.bind(null, 'g')}
                    type='number'
                    min={0}
                    max={255}
                    step={1} />
                </fieldset>
                <fieldset className={(colorMode === 'b') ? 'active' : ''}>
                  <label>B</label>
                  <input
                    value={b}
                    onFocus={this.colorMode.bind(null, 'b')}
                    onChange={this.changeRGB.bind(null, 'b')}
                    type='number'
                    min={0}
                    max={255}
                    step={1} />
                </fieldset>
              </div>
              ) : (
              <div>
                <fieldset className={(colorMode === 'h') ? 'active' : ''}>
                  <label>H</label>
                  <input
                    value={h}
                    onFocus={this.colorMode.bind(null, 'h')}
                    onChange={this.changeHSV.bind(null, 'h')}
                    type='number'
                    min={0}
                    max={359}
                    step={1} />
                </fieldset>
                <fieldset className={(colorMode === 's') ? 'active' : ''}>
                  <label>S</label>
                  <input
                    value={s}
                    onFocus={this.colorMode.bind(null, 's')}
                    onChange={this.changeHSV.bind(null, 's')}
                    type='number'
                    min={0}
                    max={100}
                    step={1} />
                </fieldset>
                <fieldset className={(colorMode === 'v') ? 'active' : ''}>
                  <label>V</label>
                  <input
                    value={v}
                    onFocus={this.colorMode.bind(null, 'v')}
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
                type="button"
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
