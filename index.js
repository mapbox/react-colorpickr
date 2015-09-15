'use strict';

var React = require('react');
var { parseCSSColor } = require('csscolorparser');
var convert = require('colr-convert');
var extend = require('xtend');
var XYControl = require('./src/xy');

var { isDark, getColor, rgbaColor,
    hsv2rgb, colorCoords, colorCoordValue } = require('./src/colorfunc');

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
    return extend({
      originalValue: value,
      reset, mode, colorAttribute
    }, getColor(value));
  },
  getDefaultProps() {
    return {
      value: '#3887be',
      reset: true,
      mode: 'rgb',
      colorAttribute: 0
    };
  },
  emitOnChange() {
    var { rgb, hex, hsv, mode, colorAttribute } = this.state;
    this.props.onChange({ rgb, hex, hsv, mode, colorAttribute });
  },
  changeHSV(p, val) {
    var { color } = this.state;
    var j = p;
    if (typeof j === 'string') {
      j = {};
      j[p] = Math.floor(parseInt(val.target.value || 0, 10));
    }
    var rgb = hsv2rgb(j.h || color.hsv[0], j.s || color.hsv[1], j.v || color.hsv[2]);
    var hex = convert.rgb.hex(rgb).slice(1);

    color = extend(color, j, { rgb: rgb, hex: hex });

    this.setState({ color: color });
    this.emitOnChange(color);
  },
  onChangeRGB(idx, event) {
    this.changeRGB(idx, Math.floor(parseInt(event.target.value, 10)));
  },
  changeRGB(idx, value) {
    var rgb = this.state.rgb.slice();
    rgb[idx] = value;
    this.setState({
      rgb: rgb,
      hsv: convert.rgb.hsv(rgb).map(Math.round),
      hex: convert.rgb.hex(rgb).slice(1)
    }, () => this.emitOnChange());
  },
  changeAlpha(e) {
    var value = e.target.value || '0';
    if (value && typeof value === 'string') {
      var alpha = Math.floor(parseFloat(value)) / 100;
      this.setState({ alpha }, this.emitOnChange);
    }
  },
  changeHex(e) {
    var hex = '#' + e.target.value.trim().replace(/#/g, '');
    var rgba = parseCSSColor(hex);
    var color = getColor(hex) || this.state.color;
    if (rgba) {
      this.setState({ color: color });
    } else {
      this.setState({ color: extend(color, { hex: e.target.value.trim() }) });
    }
    this.emitOnChange();
  },
  reset() {
    this.setState({ color: getColor(this.state.originalValue) }, this.emitOnChange);
  },
  onXYChange(pos) {
    var color = colorCoordValue(this.state.mode, pos);
    if (this.state.mode === 'rgb') this.changeRGB(color);
    if (this.state.mode === 'hsv') this.changeHSV(color);
  },
  onColorSliderChange(e) {
    var color = { [this.state.mode]: parseFloat(e.target.value) };
    if (this.state.mode === 'rgb') this.changeRGB(color);
    if (this.state.mode === 'hsv') this.changeHSV(color);
  },
  onAlphaSliderChange(e) {
    this.changeHSV({
      a: parseFloat(e.target.value)
    });
  },
  setMode(e) {
    this.setState({ mode: e.target.value }, this.emitOnChange);
  },
  setColorAttribute(colorAttribute) {
    this.setState({ colorAttribute }, this.emitOnChange);
  },
  render() {
    var { colorAttribute, hex, rgb, alpha, hsv, mode } = this.state;
    var colorAttributeValue = this.state[mode][colorAttribute];
    var colorAttributeMax;
    if (mode === 'rgb') {
      colorAttributeMax = colorAttribute === 2 ? 100 : 255;
    } else if (mode === 'hsv') {
      colorAttributeMax = 359;
    }

    var rgbaBackground = rgbaColor(rgb, alpha);
    var opacityGradient = 'linear-gradient(to right, ' +
      rgbaColor(rgb, 0) + ', ' + rgbaColor(rgb, 100) + ')';

    var hueBackground = '#' + convert.rgb.hex(convert.hsv.rgb([hsv[0], 100, 100])).slice(1);
    var coords = colorCoords(mode[colorAttribute], { rgb, hsv });

    // Slider background color for saturation & value.
    var hueSlide = {};
    if (colorAttribute === 'v') {
      hueSlide.background = `linear-gradient(to left, ${hueBackground} 0%, #000 100%)`;
    } else if (colorAttribute === 's') {
      hueSlide.background = `linear-gradient(to left, ${hueBackground} 0%, #bbb 100%)`;
    }

    // Opacity between colorspaces in RGB & SV
    var opacityHigh = {}, opacityLow = {};
    if (mode === 'rgb') {
      opacityHigh.opacity = Math.round((rgb[colorAttribute] / 255) * 100) / 100;
      opacityLow.opacity = Math.round(100 - ((rgb[colorAttribute] / 255) * 100)) / 100;
    } else if (mode === 'hsv') {
      opacityHigh.opacity = Math.round((hsv[colorAttribute] / 100) * 100) / 100;
      opacityLow.opacity = Math.round(100 - ((hsv[colorAttribute] / 100) * 100)) / 100;
    }

    return (
      <div className='colorpickr'>
        <div className='cp-body'>
          <div className='cp-col'>
            <div className='cp-selector'>
              {mode === 'rgb' &&
                <div>
                  <div className={`cp-gradient cp-rgb cp-${mode[colorAttribute]}-high`} style={opacityHigh} />
                  <div className={`cp-gradient cp-rgb cp-${mode[colorAttribute]}-low`} style={opacityLow} />
                </div>}
              {mode === 'hsv' && colorAttribute === 0 &&
                <div>
                  <div className='cp-gradient' style={{backgroundColor: hueBackground}} />
                  <div className='cp-gradient cp-light-left' />
                  <div className='cp-gradient cp-dark-bottom' />
                </div>}
              {mode === 'hsv' && colorAttribute === 1 &&
                <div>
                  <div className='cp-gradient cp-s-high' style={opacityHigh} />
                  <div className='cp-gradient cp-s-low' style={opacityLow} />
                  <div className='cp-gradient cp-dark-bottom' />
                </div>}
              {mode === 'hsv' && colorAttribute === 2 &&
                <div>
                  <div className='cp-gradient cp-v-high' style={opacityHigh} />
                  <div className='cp-gradient cp-light-bottom' style={opacityHigh} />
                  <div className='cp-gradient cp-v-low' style={opacityLow} />
                </div>}

              <XYControl
                className='cp-slider-xy'
                {...coords}
                handleClass={isDark({ rgb, alpha }) ? '' : 'dark'}
                onChange={this.onXYChange} />
            </div>
            <div className={`cp-colormode-slider cp-colormode-attribute-slider ${mode[colorAttribute]}`}>
              <input
                value={colorAttributeValue}
                style={hueSlide}
                onChange={this.onColorSliderChange}
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
                {['r', 'g', 'b'].map((component, i) => (
                  <fieldset
                    key={component}
                    className={colorAttribute === component ? 'cp-active' : ''}>
                    <label>{component.toUpperCase()}</label>
                    <input
                      value={this.state.rgb[i]}
                      onFocus={this.setColorAttribute.bind(null, i)}
                      onChange={this.onChangeRGB.bind(null, i)}
                      className={`rgb-attribute-${component}`}
                      type='number'
                      min={0}
                      max={255}
                      step={1} />
                  </fieldset>))}
              </div>) : (<div>
              {['h', 's', 'v'].map((component, i) =>
                (<fieldset
                  key={component}
                  className={colorAttribute === 'h' ? 'cp-active' : ''}>
                  <label>{component.toUpperCase()}</label>
                  <input
                    value={this.state.hsv[i]}
                    onFocus={this.setColorAttribute.bind(null, i)}
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
                  value={alpha}
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
                value={this.state.alpha}
                onChange={this.onAlphaSliderChange}
                style={{background: opacityGradient}}
                type='range'
                min={0}
                max={1} />
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
