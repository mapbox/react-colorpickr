'use strict';

var React = require('react');
var { parseCSSColor } = require('csscolorparser');
var extend = require('xtend');
var util = require('./src/util');
var XYControl = require('./src/xy');

var { getColor, rgbaColor, rgb2hsv, rgb2hex, hsv2hex,
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

  getInitialState() {
    var { value, reset, mode, colorAttribute } = this.props;
    return {
      originalValue: value,
      color: getColor(value),
      reset, mode, colorAttribute
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

<<<<<<< ac1926b777a8c5e1faf679fafe66d1c6a6946f1b
  componentWillReceiveProps: function(props) {
    if (props.value) {
      this.setState({color: this.getColor(props.value)});
    }
  },

  emitOnChange: function(change) {
=======
  emitOnChange(change) {
>>>>>>> Refactor branch
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
    var rgb = hsv2rgb(j.h || color.h, j.s || color.s, j.v || color.v);
    var hex = rgb2hex(rgb.r, rgb.g, rgb.b);

    color = extend(color, j, rgb, {hex: hex});

    this.setState({ color: color });
    this.emitOnChange(color);
  },

  changeRGB(p, val) {
    var { color } = this.state;
    var j = p;
    if (typeof j === 'string') {
      j = {};
      j[p] = Math.floor(parseInt(val.target.value || 0, 10));
    }

    var hsv = rgb2hsv(j.r || color.r, j.g || color.g, j.b || color.b);

    color = extend(color, j, hsv, {
      hex: rgb2hex(j.r || color.r, j.g || color.g, j.b || color.b)
    });

    this.setState({ color: color });
    this.emitOnChange(color);
  },

  changeAlpha(e) {
    var value = e.target.value || '0';
    if (value && typeof value === 'string') {
      var a = Math.floor(parseFloat(value));
      var color = extend(this.state.color, { a: a / 100 });
      this.setState({ color: color });
      this.emitOnChange(color);
    }
  },

  changeHex(e) {
    var hex = '#' + e.target.value.trim();
    var rgba = parseCSSColor(hex);
    var color = getColor(hex) || this.state.color;

    this.setState({
      color: rgba ? color : extend(color, { hex: e.target.value.trim() })
    }, () => {
      if (rgba) this.emitOnChange({ input: 'hex' });
    });
  },

  reset() {
    this.setState({ color: getColor(this.state.originalValue) }, () =>
      this.emitOnChange(this.state.color));
  },

  onXYChange(mode : string, pos : Object) {
    var color = colorCoordValue(mode, pos);
    if (isRGBMode(mode)) this.changeRGB(color);
    if (isHSVMode(mode)) this.changeHSV(color);
  },

  onColorSliderChange(mode, e) {
    var color = { [mode]: parseFloat(e.target.value) };
    if (isRGBMode(mode)) this.changeRGB(color);
    if (isHSVMode(mode)) this.changeHSV(color);
  },

  onAlphaSliderChange(e) {
    this.changeHSV({
      a: Math.floor(parseFloat(e.target.value)) / 100
    });
  },

  setMode(e) {
    var obj = { mode: e.target.value };
    this.setState(obj);
    this.emitOnChange(obj);
  },

  setColorAttribute(attribute) {
    var obj = { colorAttribute: attribute };
    this.setState(obj);
    this.emitOnChange(obj);
  },

  render() {
    var { colorAttribute, color } = this.state;
    var { r, g, b, h, hex } = color;

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

    // Slider background color for saturation & value.
    var hueSlide = {};
    if (colorAttribute === 'v') {
      hueSlide.background = `linear-gradient(to left, ${hueBackground} 0%, #000 100%)`;
    } else if (colorAttribute === 's') {
      hueSlide.background = `linear-gradient(to left, ${hueBackground} 0%, #bbb 100%)`;
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
              {isRGBMode(colorAttribute) &&
                <div>
                  <div className={`cp-gradient cp-rgb cp-${colorAttribute}-high`} style={opacityHigh} />
                  <div className={`cp-gradient cp-rgb cp-${colorAttribute}-low`} style={opacityLow} />
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
                handleClass={util.isDark(color) ? '' : 'dark'}
                onChange={this.onXYChange.bind(null, colorAttribute)} />
            </div>
            <div className={`cp-colormode-slider cp-colormode-attribute-slider ${colorAttribute}`}>
              <input
                value={colorAttributeValue}
                style={hueSlide}
                onChange={this.onColorSliderChange.bind(null, colorAttribute)}
                className='cp-colormode-slider-input'
                type='range'
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
              {this.state.mode === 'rgb' ? (<div>
                {['r', 'g', 'b'].map(component => (
                  <fieldset
                    key={component}
                    className={colorAttribute === component ? 'cp-active' : ''}>
                    <label>{component.toUpperCase()}</label>
                    <input
                      value={color[component]}
                      onFocus={this.setColorAttribute.bind(null, component)}
                      onChange={this.changeRGB.bind(null, component)}
                      className={`rgb-attribute-${component}`}
                      type='number'
                      min={0}
                      max={255}
                      step={1} />
                  </fieldset>))}
              </div>) : (<div>
              {['h', 's', 'v'].map(component =>
                (<fieldset
                  key={component}
                  className={colorAttribute === 'h' ? 'cp-active' : ''}>
                  <label>{component.toUpperCase()}</label>
                  <input
                    value={color[component]}
                    onFocus={this.setColorAttribute.bind(null, component)}
                    onChange={this.changeHSV.bind(null, component)}
                    className={`hsv-attribute-${component}`}
                    type='number'
                    min={0}
                    max={component === 'h' ? 359 : 100}
                    step={1} />
                </fieldset>))}
              </div>)}

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
              <input
                className='cp-alpha-slider-input'
                value={a}
                onChange={this.onAlphaSliderChange}
                style={{background: opacityGradient}}
                type='range'
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
                onChange={this.changeHex}
                type='text' />
            </fieldset>
          </div>
        </div>
      </div>
    );
  }
});
