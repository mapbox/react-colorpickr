'use strict';

require('babelify/polyfill'); // For Object.assign

var React = require('react');
var colorParser = require('csscolorparser').parseCSSColor;
var store = require('store');

var colorFunc = require('./src/colorfunc');
var XYControl = require('./src/xy');

var rgbaColor = colorFunc.getRGBA,
  rgb2hsv = colorFunc.rgb2hsv,
  hsv2hex = colorFunc.hsv2hex,
  hsv2rgb = colorFunc.hsv2rgb,
  rgb2hex = colorFunc.rgb2hex,
  colorCoords = colorFunc.colorCoords,
  colorCoordValue = colorFunc.colorCoordValue;

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
      mode: (store.get('mode')) ? store.get('mode') : 'rgb',
      colorMode: (store.get('colorMode')) ? store.get('colorMode') : 'h',
    };
  },

  componentWillReceiveProps: function(props) {
    this.setState({
      color: this.getColor(props.value)
    });

    // Hard update defaultValue.
    this.refs.hex.getDOMNode().value = this.state.color.hex;
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
    this.props.onChange(Object.assign(color, j, rgb, {hex: hex}));
  },

  changeRGB: function(p, val) {
    var j = p;
    if (typeof j === 'string') {
      j = {};
      j[p] = Math.floor(parseInt(val.target.value, 10));
    }
    var color = this.state.color;
    var hsv = rgb2hsv(j.r || color.r, j.g || color.g, j.b || color.b);
    this.props.onChange(Object.assign(color, j, hsv, {
      hex: rgb2hex(j.r || color.r, j.g || color.g, j.b || color.b)
    }));
  },

  changeAlpha: function(e) {
    var value = e.target.value;
    if (value && typeof value === 'string') {
      var a = Math.floor(parseFloat(e.target.value, 10));
      this.props.onChange(Object.assign(this.state.color, {a: a}));
    }
  },

  changeHEX: function(e) {
    var hex = e.target.value.trim();
    var rgba = colorParser(hex);

    if (rgba) {
      var rgb = {
        r: rgba[0],
        g: rgba[1],
        b: rgba[2]
      };
      this.changeRGB(Object.assign(rgb, {hex: hex}));
    }
  },

  reset: function(e) {
    this.props.onChange(this.getColor(this.original));
  },

  getColor: function(cssColor) {
    var rgba = colorParser(cssColor);
    var r = rgba[0],
      g = rgba[1],
      b = rgba[2],
      a = rgba[3] * 100;

    var hsv = rgb2hsv(r, g, b);

    return Object.assign(hsv, {
      r: r,
      g: g,
      b: b,
      a: a,
      hex: rgb2hex(r, g, b)
    });
  },

  _onXYChange: function(mode, pos) {
    var color = colorCoordValue(mode, pos);
    if (['r', 'g', 'b'].indexOf(mode) >= 0) this.changeRGB(color);
    if (['h', 's', 'v'].indexOf(mode) >= 0) this.changeHSV(color);
  },

  _onColorSliderChange: function(mode, e) {
    var color = {};
    color[mode] = e.target.value;
    if (['r', 'g', 'b'].indexOf(mode) >= 0) this.changeRGB(color);
    if (['h', 's', 'v'].indexOf(mode) >= 0) this.changeHSV(color);
  },

  _onAlphaSliderChange: function(e) {
    this.changeHSV({
      a: e.target.value
    });
  },

  _onClick: function(e) {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
  },

  colorMode: function(mode) {
    store.set('colorMode', mode);
    this.setState({colorMode: mode});
  },

  setMode: function(e) {
    store.set('mode', e.target.value);
    this.setState({mode: e.target.value});
  },

  render: function () {
    var colorMode = this.state.colorMode;
    var color = this.state.color;
    var r = color.r,
        g = color.g,
        b = color.b;

    var h = color.h,
        s = color.s,
        v = color.v;

    var a = color.a,
        hex = color.hex;

    var colorModeValue = color[colorMode];
    var colorModeX = color[colorMode];

    var colorModeMax = 100;
    if (colorMode === 'r' ||
        colorMode === 'g' ||
        colorMode === 'b') colorModeMax = 255;
    if (colorMode === 'h') colorModeMax = 359;

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
      hueSlide.background = 'linear-gradient(to left, #000000 0%, ' + hueBackground + ' 20%, #ffffff 100%)';
    } else if (colorMode === 's') {
      hueSlide.background = 'linear-gradient(to left, #bbb 0%, ' + hueBackground + ' 100%)';
    }

    // Opacity between colorspaces in RGB
    var opacityTop = {}, opacityBottom = {};
    if (colorMode === 'r') {
      opacityTop.opacity = Math.round((color.r / 255) * 100) / 100;
      opacityBottom.opacity = Math.round(100 - ((color.r / 255) * 100)) / 100;
    } else if (colorMode === 'g') {
      opacityTop.opacity = Math.round((color.g / 255) * 100) / 100;
      opacityBottom.opacity = Math.round(100 - ((color.g / 255) * 100)) / 100;
    } else if (colorMode === 'b') {
      opacityTop.opacity = Math.round((color.b / 255) * 100) / 100;
      opacityBottom.opacity = Math.round(100 - ((color.b / 255) * 100)) / 100;
    }

    return (
      /* jshint ignore:start */
      <div className='colorpickr' onClick={this._onClick}>
        <div className='colorpickr-body'>
          <div className='col'>
            <div className='selector'>

              {(colorMode === 'r') &&
                <div>
                  <div className='gradient rA' style={opacityTop} />
                  <div className='gradient rB' style={opacityBottom} />
                  <div className='gradient light-topright' />
                  <div className='gradient dark-bottomleft' />
                </div>
              }
              {(colorMode === 'g') &&
                <div>
                  <div className='gradient light-topright' style={opacityTop} />
                  <div className='gradient gA' style={opacityTop} />
                  <div className='gradient gB' style={opacityBottom} />
                  <div className='gradient dark-bottomleft' style={opacityBottom} />
                </div>
              }
              {(colorMode === 'b') &&
                <div>
                  <div className='gradient light-topright' style={opacityTop} />
                  <div className='gradient bA' style={opacityTop} />
                  <div className='gradient bB' style={opacityBottom} />
                  <div className='gradient dark-bottomleft' style={opacityBottom} />
                </div>
              }
              {(colorMode === 'h') &&
                <div>
                  <div className='gradient' style={{backgroundColor: hueBackground}} />
                  <div className='gradient light' />
                  <div className='gradient dark' />
                </div>
              }
              {(colorMode === 's') &&
                <div>
                  <div className='gradient s' />
                  <div className='gradient light' />
                  <div className='gradient dark' />
                </div>
              }
              {(colorMode === 'v') &&
                <div>
                  <div className='gradient v' />
                  <div className='gradient light' />
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
          <div className='output'>
            <div className='fill-tile color'>
              <div className='swatch' style={{backgroundColor: rgbaBackground}}></div>
            </div>
            <label>{rgbaBackground}</label>
          </div>
          <div className='actions'>
            <fieldset className='inline hex-input'>
              <label>#</label>
              <input
                defaultValue={hex}
                ref='hex'
                onChange={this.changeHEX}
                type='text' />
            </fieldset>

            {this.props.reset && <button onClick={this.reset}>Reset</button>}
          </div>
        </div>

      </div>
      /* jshint ignore:end */
    );
  }
});
