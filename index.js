'use strict';

var React = require('react');
var { parseCSSColor } = require('csscolorparser');
var convert = require('colr-convert');
var extend = require('xtend');
var XYControl = require('./src/xy');

var { isDark, getColor, colorCoords, colorCoordValue } = require('./src/colorfunc');

var rgbaColor = (rgb, a) => 'rgba(' + rgb.concat(a / 100).join(',') + ')';

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
  onChangeHSV(idx, event) {
    this.changeHSV(idx, Math.floor(parseInt(event.target.value, 10)));
  },
  changeHSV(idx, value) {
    var hsv = this.state.hsv.slice();
    hsv[idx] = value;
    var rgb = convert.hsv.rgb(hsv).map(Math.round);
    this.setState({
      rgb: rgb,
      hsv: hsv,
      hex: convert.rgb.hex(rgb).slice(1)
    }, this.emitOnChange);
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
    if (value) {
      var alpha = parseFloat(value);
      this.setState({ alpha }, this.emitOnChange);
    }
  },
  changeHex(e) {
    var hex = '#' + e.target.value.trim().replace(/#/g, '');
    var rgba = parseCSSColor(hex);
    var color = getColor(hex) || this.state.color;

    this.setState({
      color: rgba ? color : extend(color, { hex: e.target.value.trim() })
    }, () => {
      if (rgba) this.emitOnChange({ input: 'hex' });
    });
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
  setMode(e) {
    this.setState({ mode: e.target.value }, this.emitOnChange);
  },
  setColorAttribute(colorAttribute) {
    this.setState({ colorAttribute }, this.emitOnChange);
  },
  render() {
    var { colorAttribute, rgb, hsv, mode } = this.state;
    var colorAttributeValue = this.state[mode][colorAttribute];
    var colorAttributeMax;
    if (mode === 'rgb') {
      colorAttributeMax = colorAttribute === 2 ? 100 : 255;
    } else if (mode === 'hsv') {
      colorAttributeMax = 359;
    }

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
                handleClass={isDark({ rgb, alpha: this.state.alpha }) ? '' : 'dark'}
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
              {['rgb', 'hsv'].map(modeButton => (<button
                key={modeButton}
                onClick={this.setMode}
                className={`cp-mode-${modeButton} ${this.state.mode === modeButton ? 'cp-active' : ''}`}
                value={modeButton}>{modeButton.toUpperCase()}
              </button>))}
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
                  className={colorAttribute === 0 ? 'cp-active' : ''}>
                  <label>{component.toUpperCase()}</label>
                  <input
                    value={this.state.hsv[i]}
                    onFocus={this.setColorAttribute.bind(null, i)}
                    onChange={this.onChangeHSV.bind(null, i)}
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
                  value={this.state.alpha}
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
                onChange={this.changeAlpha}
                style={{ background: opacityGradient }}
                type='range'
                step={1}
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
                style={{ backgroundColor: rgbaColor(rgb, this.state.alpha) }}>
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
                value={this.state.hex}
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
