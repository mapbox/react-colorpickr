'use strict';

var React = require('react');
var extend = require('xtend');
var Range = require('react-range');

var XYControl = require('./src/xy');
var { parseCSSColor } = require('csscolorparser');

var { rgbaColor, rgb2hsv, rgb2hex, hsv2hex,
    hsv2rgb, colorCoords, colorCoordValue, getColor, isDark } = require('./src/colorfunc');

var isRGBMode = (c) => (c === 'r' || c === 'g' || c === 'b');
var isHSVMode = (c) => (c === 'h' || c === 's' || c === 'v');

module.exports = React.createClass({

  propTypes: {
    onChange: React.PropTypes.func.isRequired,
    colorAttribute: React.PropTypes.number,
    mode: React.PropTypes.string,
    value: React.PropTypes.string,
    reset: React.PropTypes.bool
  },

  getInitialState() {
    var { value, reset, mode, colorAttribute } = this.props;
    return {
      originalValue: value,
      reset,
      mode,
      colorAttribute,
      color: getColor(value)
    };
  },

  getDefaultProps() {
    return {
      value: '#3887be',
      reset: true,
      mode: 'rgb',
      colorAttribute: 'h'
    };
  },

  componentWillReceiveProps: function(props) {
    if (props.value) this.setState({color: getColor(props.value)});
  },

  emitOnChange(change) {
    var { color, mode, colorAttribute } = this.state;
    this.props.onChange(extend(
      color,
      { mode: mode },
      { colorAttribute: colorAttribute },
      change
    ));
  },

  changeHSV(p, val) {
    var { color } = this.state;
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

    color = extend(color, j, rgb, {hex: hex});

    this.setState({ color: color }, () => {
      this.emitOnChange(color);
    });
  },

  changeRGB(p, val) {
    var { color } = this.state;
    var j = p;
    if (typeof j === 'string') {
      j = {};
      j[p] = Math.floor(parseInt(val.target.value || 0, 10));
    }
    var r = 'r' in j ? j.r : color.r,
      g = 'g' in j ? j.g : color.g,
      b = 'b' in j ? j.b : color.b;
    var hsv = rgb2hsv(r, g, b);

    color = extend(color, j, hsv, {
      hex: rgb2hex(r, g, b)
    });

    this.setState({ color: color }, () => {
      this.emitOnChange(color);
    });
  },

  changeAlpha(e) {
    var value = e.target.value || '0';
    if (value && typeof value === 'string') {
      var a = Math.floor(parseFloat(value));
      var color = extend(this.state.color, { a: a / 100 });
      this.setState({ color: color }, () => {
        this.emitOnChange(color);
      });
    }
  },

  changeHEX(e) {
    var hex = '#' + e.target.value.trim();
    var rgba = parseCSSColor(hex);

    var color = getColor(hex) || this.state.color;

    this.setState({
      color: rgba ? color : extend(color, { hex: e.target.value.trim() })
    }, () => {
      if (rgba) this.emitOnChange({ input: 'hex' });
    });
  },

  reset(e) {
    this.setState({ color: getColor(this.state.originalValue) }, this.emitOnChange);
  },

  _onXYChange(mode, pos) {
    var color = colorCoordValue(mode, pos);
    if (isRGBMode(mode)) this.changeRGB(color);
    if (isHSVMode(mode)) this.changeHSV(color);
  },

  _onColorSliderChange(mode, e) {
    var color = {};
    color[mode] = parseFloat(e.target.value);
    if (isRGBMode(mode)) this.changeRGB(color);
    if (isHSVMode(mode)) this.changeHSV(color);
  },

  _onAlphaSliderChange(e) {
    this.changeHSV({
      a: Math.floor(parseFloat(e.target.value)) / 100
    });
  },

  setMode(e) {
    this.setState({ mode: e.target.value }, () => {
      this.emitOnChange(obj);
    });
  },

  setColorAttribute(attribute) {
    this.setState({ colorAttribute: attribute }, () => {
      this.emitOnChange(obj);
    });
  },

  render() {
    var { colorAttribute, color } = this.state;
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

    return (
      <div className='colorpickr'>
        <div className='cp-body'>
          <div className='cp-col'>
            <div className='cp-selector'>
              {colorAttribute === 'r' &&
                <div>
                  <div className='cp-gradient cp-rgb cp-r-high' style={opacityHigh} />
                  <div className='cp-gradient cp-rgb cp-r-low' style={opacityLow} />
                </div>
              }
              {colorAttribute === 'g' &&
                <div>
                  <div className='cp-gradient cp-rgb cp-g-high' style={opacityHigh} />
                  <div className='cp-gradient cp-rgb cp-g-low' style={opacityLow} />
                </div>
              }
              {colorAttribute === 'b' &&
                <div>
                  <div className='cp-gradient cp-rgb cp-b-high' style={opacityHigh} />
                  <div className='cp-gradient cp-rgb cp-b-low' style={opacityLow} />
                </div>
              }
              {colorAttribute === 'h' &&
                <div>
                  <div className='cp-gradient' style={{backgroundColor: hueBackground}} />
                  <div className='cp-gradient cp-light-left' />
                  <div className='cp-gradient cp-dark-bottom' />
                </div>
              }
              {colorAttribute === 's' &&
                <div>
                  <div className='cp-gradient cp-s-high' style={opacityHigh} />
                  <div className='cp-gradient cp-s-low' style={opacityLow} />
                  <div className='cp-gradient cp-dark-bottom' />
                </div>
              }
              {colorAttribute === 'v' &&
                <div>
                  <div className='cp-gradient cp-v-high' style={opacityHigh} />
                  <div className='cp-gradient cp-light-bottom' style={opacityHigh} />
                  <div className='cp-gradient cp-v-low' style={opacityLow} />
                </div>
              }

              <XYControl
                className='cp-slider-xy'
                {...coords}
                handleClass={isDark([r,g,b,a]) ? '' : 'dark'}
                onChange={this._onXYChange.bind(null, colorAttribute)} />
            </div>
            <div className={`cp-colormode-slider cp-colormode-attribute-slider ${colorAttribute}`}>
              <Range
                value={colorAttributeValue}
                style={hueSlide}
                onChange={this._onColorSliderChange.bind(null, colorAttribute)}
                className='cp-colormode-slider-input'
                min={0}
                max={colorAttributeMax} />
            </div>
          </div>

          <div className='cp-col'>
            <div className='cp-mode-tabs'>
              <button
                onClick={this.setMode}
                className={`cp-mode-rgb ${this.state.mode === 'rgb' ? 'cp-active' : ''}`}
                value='rgb'>RGB
              </button>
              <button
                className={`cp-mode-hsv ${this.state.mode === 'hsv' ? 'cp-active' : ''}`}
                onClick={this.setMode}
                value='hsv'>HSV
              </button>
            </div>

            <div className='cp-inputs'>
              {this.state.mode === 'rgb' ? (
              <div>
                <fieldset className={colorAttribute === 'r' ? 'cp-active' : ''}>
                  <label>R</label>
                  <input
                    value={r}
                    onFocus={this.setColorAttribute.bind(null, 'r')}
                    onChange={this.changeRGB.bind(null, 'r')}
                    className='rgb-attribute-r'
                    type='number'
                    min={0}
                    max={255}
                    step={1} />
                </fieldset>
                <fieldset className={colorAttribute === 'g' ? 'cp-active' : ''}>
                  <label>G</label>
                  <input
                    value={g}
                    onFocus={this.setColorAttribute.bind(null, 'g')}
                    onChange={this.changeRGB.bind(null, 'g')}
                    className='rgb-attribute-g'
                    type='number'
                    min={0}
                    max={255}
                    step={1} />
                </fieldset>
                <fieldset className={colorAttribute === 'b' ? 'cp-active' : ''}>
                  <label>B</label>
                  <input
                    value={b}
                    onFocus={this.setColorAttribute.bind(null, 'b')}
                    onChange={this.changeRGB.bind(null, 'b')}
                    className='rgb-attribute-b'
                    type='number'
                    min={0}
                    max={255}
                    step={1} />
                </fieldset>
              </div>
              ) : (
              <div>
                <fieldset className={colorAttribute === 'h' ? 'cp-active' : ''}>
                  <label>H</label>
                  <input
                    value={h}
                    onFocus={this.setColorAttribute.bind(null, 'h')}
                    onChange={this.changeHSV.bind(null, 'h')}
                    className='hsv-attribute-h'
                    type='number'
                    min={0}
                    max={359}
                    step={1} />
                </fieldset>
                <fieldset className={colorAttribute === 's' ? 'cp-active' : ''}>
                  <label>S</label>
                  <input
                    value={s}
                    onFocus={this.setColorAttribute.bind(null, 's')}
                    onChange={this.changeHSV.bind(null, 's')}
                    className='hsv-attribute-s'
                    type='number'
                    min={0}
                    max={100}
                    step={1} />
                </fieldset>
                <fieldset className={colorAttribute === 'v' ? 'cp-active' : ''}>
                  <label>V</label>
                  <input
                    value={v}
                    onFocus={this.setColorAttribute.bind(null, 'v')}
                    onChange={this.changeHSV.bind(null, 'v')}
                    className='hsv-attribute-v'
                    type='number'
                    min={0}
                    max={100}
                    step={1} />
                </fieldset>
              </div>
              )}

              <fieldset>
                <label className='cp-label'>{String.fromCharCode(945)}</label>
                <input
                  value={a}
                  onChange={this.changeAlpha}
                  type='number'
                  min={0}
                  max={100}
                  step={1} />
              </fieldset>
            </div>
            <fieldset className='cp-fill-tile'>
              <Range
                className='cp-alpha-slider-input'
                value={a}
                onChange={this._onAlphaSliderChange}
                style={{background: opacityGradient}}
                min={0}
                max={100} />
            </fieldset>
          </div>
        </div>

        <div className='cp-floor'>
          <div className='cp-actions cp-fl'>
            <span className='cp-fl cp-fill-tile'>
              <div
                className='cp-swatch'
                style={{backgroundColor: rgbaBackground}}>
              </div>
            </span>
            {this.state.reset && <span className='cp-fl cp-fill-tile'>
              <button
                className='cp-swatch cp-swatch-reset'
                title='Reset color'
                style={{backgroundColor: this.state.originalValue}}
                onClick={this.reset}>
              </button>
            </span>}
          </div>
          <div className='cp-output cp-fr'>
            <fieldset className='cp-hex cp-fr'>
              <label>#</label>
              <input
                value={hex}
                className='cp-hex-input'
                onChange={this.changeHEX}
                type='text' />
            </fieldset>
          </div>
        </div>
      </div>
    );
  }
});
