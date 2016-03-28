'use strict';

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


var { rgbaColor, rgb2hsv, rgb2hex, hsv2hex,
    hsv2rgb, colorCoords, colorCoordValue, getColor, isDark } = require('./colorfunc');

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
    this.props.onChange(Object.assign({},
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

    color = Object.assign({}, color, j, rgb, {hex: hex});

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

    color = Object.assign({}, color, j, hsv, {
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
      var color = Object.assign({}, this.state.color, { a: a / 100 });
      this.setState({ color: color }, () => {
        this.emitOnChange(color);
      });
    }
  },

  changeHEX(e) {
    var hex = '#' + e.target.value.trim();
    var isValid = tinyColor(hex).isValid();

    var color = getColor(hex) || this.state.color;

    this.setState({
      color: isValid ? color : Object.assign({}, color, { hex: e.target.value.trim() })
    }, () => {
      if (isValid) this.emitOnChange({ input: 'hex' });
    });
  },

  reset() {
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
    var obj = { mode: e.target.value };
    this.setState(obj, () => {
      this.emitOnChange(obj);
    });
  },

  setColorAttribute(attribute) {
    var obj = { colorAttribute: attribute };
    this.setState(obj, () => {
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
              <RGBGradient 
                active={colorAttribute === 'r'} 
                color='r' 
                opacityLow={opacityLow}
                opacityHigh={opacityHigh}
              />
              <RGBGradient 
                active={colorAttribute === 'g'} 
                color='g' 
                opacityLow={opacityLow}
                opacityHigh={opacityHigh}
              />
              <RGBGradient 
                active={colorAttribute === 'b'} 
                color='b' 
                opacityLow={opacityLow}
                opacityHigh={opacityHigh}
              />

              <HGradient active={colorAttribute === 'h'} hueBackground={hueBackground} />
              <SVGradient
                active={colorAttribute === 's'}
                color='s'
                opacityLow={opacityLow}
                opacityHigh={opacityHigh}
              />
              <SVGradient
                active={colorAttribute === 'v'}
                color='v'
                opacityLow={opacityLow}
                opacityHigh={opacityHigh}
              />

              <XYControl
                className='cp-slider-xy'
                {...coords}
                handleClass={isDark([r,g,b,a]) ? '' : 'dark'}
                onChange={this._onXYChange.bind(null, colorAttribute)} />
            </div>
            <div className={`cp-colormode-slider cp-colormode-attribute-slider ${colorAttribute}`}>
              <input
                type='range'
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
                <fieldset className={`rgb-attribute-r ${colorAttribute === 'r' ? 'cp-active' : ''}`}>
                  <ModeInput 
                    checked={colorAttribute === 'r'}
                    onChange={this.setColorAttribute.bind(null, 'r')}
                  />
                  <RGBInput
                    value={r}
                    onChange={this.changeRGB.bind(null, 'r')}
                    label='R'
                  />
                </fieldset>
                <fieldset className={`rgb-attribute-g ${colorAttribute === 'g' ? 'cp-active' : ''}`}>
                  <ModeInput 
                    checked={colorAttribute === 'g'}
                    onChange={this.setColorAttribute.bind(null, 'g')}
                  />
                  <RGBInput
                    value={g}
                    onChange={this.changeRGB.bind(null, 'g')}
                    label='G'
                  />
                </fieldset>
                <fieldset className={`rgb-attribute-b ${colorAttribute === 'b' ? 'cp-active' : ''}`}>
                  <ModeInput 
                    checked={colorAttribute === 'b'}
                    onChange={this.setColorAttribute.bind(null, 'b')}
                  />
                  <RGBInput
                    value={b}
                    onChange={this.changeRGB.bind(null, 'b')}
                    label='B'
                  />
                </fieldset>
              </div>
              ) : (
              <div>
                <fieldset className={`hsv-attribute-h ${colorAttribute === 'h' ? 'cp-active' : ''}`}>
                  <ModeInput 
                    checked={colorAttribute === 'h'}
                    onChange={this.setColorAttribute.bind(null, 'h')}
                  />
                  <HInput
                    value={h}
                    onChange={this.changeHSV.bind(null, 'h')}
                    label='H'
                  />
                </fieldset>
                <fieldset className={`hsv-attribute-s ${colorAttribute === 's' ? 'cp-active' : ''}`}>
                    <ModeInput 
                      checked={colorAttribute === 's'}
                      onChange={this.setColorAttribute.bind(null, 's')}
                    />
                    <SVAlphaInput
                      value={s}
                      onChange={this.changeHSV.bind(null, 's')}
                      label='S'
                    />
                </fieldset>
                <fieldset className={`hsv-attribute-v ${colorAttribute === 'v' ? 'cp-active' : ''}`}>
                  <ModeInput 
                    checked={colorAttribute === 'v'}
                    onChange={this.setColorAttribute.bind(null, 'v')}
                  />
                  <SVAlphaInput
                    value={v}
                    onChange={this.changeHSV.bind(null, 'v')}
                    label='V'
                  />
                </fieldset>
              </div>
              )}

              <fieldset className='cp-relative'>
                <SVAlphaInput
                  value={a}
                  onChange={this.changeAlpha}
                  label={String.fromCharCode(945)}
                />
              </fieldset>
            </div>
            <fieldset className='cp-fill-tile'>
              <input
                type='range'
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
            <fieldset className='cp-hex cp-relative cp-fr'>
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
