'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import XYControl from './xy';
import ModeInput from './components/inputs/mode-input';
import RGBInput from './components/inputs/rgb-input';
import HInput from './components/inputs/h-input';
import SVAlphaInput from './components/inputs/sv-alpha-input';
import RGBGradient from './components/gradients/rgb-gradient';
import HGradient from './components/gradients/h-gradient';
import SVGradient from './components/gradients/sv-gradient';
import tinyColor from 'tinycolor2';
import themeable from 'react-themeable';

import {
  rgbaColor,
  rgb2hsv,
  rgb2hex,
  hsv2hex,
  hsv2rgb,
  colorCoords,
  colorCoordValue,
  getColor,
  isDark
} from './colorfunc';

const isRGBMode = c => c === 'r' || c === 'g' || c === 'b';
const isHSVMode = c => c === 'h' || c === 's' || c === 'v';

const defaultTheme = {
  container: 'colorpickr round inline-block bg-gray-faint p12 txt-s',
  topWrapper: 'flex-parent',
  gradientContainer: 'flex-child z1 w180 h180 relative',
  controlsContainer: 'flex-child w120 pl24',
  buttonModeContainer: 'grid mb12',
  buttonMode: 'col col--6 btn btn--gray-light py3',
  buttonModeFirst: 'round-l',
  buttonModeLast: 'round-r',
  inputModeContainer: 'mb3 flex-parent',
  alphaContainer: 'mb3 mt12 relative',
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
  numberInputLabel: 'absolute top left pl6 py3 color-gray-light txt-bold',
  numberInput: 'w-full pl18 input input--s bg-white',
  modeInputContainer: 'flex-child flex-child--no-shrink w24 flex-parent flex-parent--center-cross',
  modeInput: 'cursor-pointer',
  bottomWrapper: 'flex-parent mt6',
  bottomContainerLeft: 'flex-child w180 flex-parent flex-parent--center-cross color-gray',
  newSwatchContainer: 'ml3 inline-block h24 w36 round-l relative',
  newSwatch: 'w-full h-full round-l absolute',
  currentSwatchWrapper: 'flex-parent flex-parent--center-cross',
  currentSwatchContainer: 'inline-block h24 w36 round-r border-l border--gray-faint relative mr3',
  currentSwatch: 'w-full h-full round-r absolute',
  bottomContainerRight: 'flex-child w120 pl24 align-r',
  hexContainer: 'relative'
};

class ColorPickr extends React.Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    colorAttribute: PropTypes.string,
    theme: PropTypes.object,
    mode: PropTypes.string,
    value: PropTypes.string,
    reset: PropTypes.bool
  };

  constructor(props) {
    super(props);
    const { value, reset, mode, colorAttribute } = props;
    const modeInputName = `mode-${Math.random()}`;

    this.state = {
      originalValue: value,
      reset,
      mode,
      modeInputName,
      colorAttribute,
      color: getColor(value)
    };
  }

  static defaultProps = {
    value: '#4264fb',
    reset: true,
    mode: 'rgb',
    colorAttribute: 'h',
    theme: {}
  };

  componentWillReceiveProps(props) {
    if (props.value) this.setState({ color: getColor(props.value) });
  }

  emitOnChange(change) {
    const { color, mode, colorAttribute } = this.state;
    this.props.onChange(
      Object.assign({}, color, { mode: mode }, { colorAttribute: colorAttribute }, change)
    );
  }

  changeHSV = (p, e) => {
    const color = this.state.color;
    let j = p;
    if (typeof j === 'string') {
      j = {};
      j[p] = Math.floor(parseInt(e.target.value || 0, 10));
    }
    const h = 'h' in j ? j.h : color.h,
      s = 's' in j ? j.s : color.s,
      v = 'v' in j ? j.v : color.v;
    const rgb = hsv2rgb(h, s, v);
    const hex = rgb2hex(rgb.r, rgb.g, rgb.b);

    const changedColor = Object.assign({}, color, j, rgb, { hex: hex });

    this.setState({ color: changedColor }, () => {
      this.emitOnChange(changedColor);
    });
  };

  changeRGB = (p, e) => {
    const color = this.state.color;
    let j = p;
    if (typeof j === 'string') {
      j = {};
      j[p] = Math.floor(parseInt(e.target.value || 0, 10));
    }
    const r = 'r' in j ? j.r : color.r,
      g = 'g' in j ? j.g : color.g,
      b = 'b' in j ? j.b : color.b;
    const hsv = rgb2hsv(r, g, b);

    const changedColor = Object.assign({}, color, j, hsv, {
      hex: rgb2hex(r, g, b)
    });

    this.setState({ color: changedColor }, () => {
      this.emitOnChange(changedColor);
    });
  };

  changeAlpha = e => {
    const value = e.target.value || '0';
    if (value && typeof value === 'string') {
      const a = Math.floor(parseFloat(value));
      const color = Object.assign({}, this.state.color, { a: a / 100 });
      this.setState({ color: color }, () => {
        this.emitOnChange(color);
      });
    }
  };

  changeHEX = e => {
    const hex = '#' + e.target.value.trim();
    const isValid = tinyColor(hex).isValid();

    const color = getColor(hex) || this.state.color;

    this.setState(
      {
        color: isValid ? color : Object.assign({}, color, { hex: e.target.value.trim() })
      },
      () => {
        if (isValid) this.emitOnChange({ input: 'hex' });
      }
    );
  };

  reset = () => {
    this.setState({ color: getColor(this.state.originalValue) }, this.emitOnChange);
  };

  _onXYChange = (mode, pos) => {
    const color = colorCoordValue(mode, pos);
    if (isRGBMode(mode)) this.changeRGB(color);
    if (isHSVMode(mode)) this.changeHSV(color);
  };

  _onColorSliderChange(mode, e) {
    const color = {};
    color[mode] = parseFloat(e.target.value);
    if (isRGBMode(mode)) this.changeRGB(color);
    if (isHSVMode(mode)) this.changeHSV(color);
  }

  _onAlphaSliderChange = e => {
    this.changeHSV({
      a: Math.floor(parseFloat(e.target.value)) / 100
    });
  };

  setMode = e => {
    const obj = { mode: e.target.value };
    this.setState(obj, () => {
      this.emitOnChange(obj);
    });
  };

  setColorAttribute(attribute) {
    const obj = { colorAttribute: attribute };
    this.setState(obj, () => {
      this.emitOnChange(obj);
    });
  }

  render() {
    const themeObject = Object.assign({}, defaultTheme, this.props.theme);
    const theme = themeable(themeObject);
    const { colorAttribute, color } = this.state;
    const { r, g, b, h, s, v, hex } = color;

    const a = Math.round(color.a * 100);

    const colorAttributeValue = color[colorAttribute];

    let colorAttributeMax;
    if (isRGBMode(colorAttribute)) {
      colorAttributeMax = 255;
    } else if (colorAttribute === 'h') {
      colorAttributeMax = 359;
    } else {
      colorAttributeMax = 100;
    }

    const rgbaBackground = rgbaColor(r, g, b, a);
    const opacityGradient =
      'linear-gradient(to right, ' + rgbaColor(r, g, b, 0) + ', ' + rgbaColor(r, g, b, 100) + ')';

    const hueBackground = '#' + hsv2hex(h, 100, 100);
    const coords = colorCoords(colorAttribute, color);

    // Slider background color for saturation & value.
    const hueSlide = {};
    if (colorAttribute === 'v') {
      hueSlide.background = 'linear-gradient(to left, ' + hueBackground + ' 0%, #000 100%)';
    } else if (colorAttribute === 's') {
      hueSlide.background = 'linear-gradient(to left, ' + hueBackground + ' 0%, #bbb 100%)';
    }

    // Opacity between colorspaces in RGB & SV
    const opacityHigh = {},
      opacityLow = {};
    if (['r', 'g', 'b'].indexOf(colorAttribute) >= 0) {
      opacityHigh.opacity = Math.round(color[colorAttribute] / 255 * 100) / 100;
      opacityLow.opacity = Math.round(100 - color[colorAttribute] / 255 * 100) / 100;
    } else if (['s', 'v'].indexOf(colorAttribute) >= 0) {
      opacityHigh.opacity = Math.round(color[colorAttribute] / 100 * 100) / 100;
      opacityLow.opacity = Math.round(100 - color[colorAttribute] / 100 * 100) / 100;
    }

    return (
      <div {...theme(1, 'container')}>
        <div {...theme(2, 'topWrapper')}>
          <div {...theme(3, 'gradientContainer')}>
            <RGBGradient
              active={colorAttribute === 'r'}
              theme={themeObject}
              color="r"
              opacityLow={opacityLow}
              opacityHigh={opacityHigh}
            />
            <RGBGradient
              active={colorAttribute === 'g'}
              theme={themeObject}
              color="g"
              opacityLow={opacityLow}
              opacityHigh={opacityHigh}
            />
            <RGBGradient
              active={colorAttribute === 'b'}
              theme={themeObject}
              color="b"
              opacityLow={opacityLow}
              opacityHigh={opacityHigh}
            />

            <HGradient
              theme={themeObject}
              active={colorAttribute === 'h'}
              hueBackground={hueBackground}
            />
            <SVGradient
              active={colorAttribute === 's'}
              theme={themeObject}
              color="s"
              opacityLow={opacityLow}
              opacityHigh={opacityHigh}
            />
            <SVGradient
              active={colorAttribute === 'v'}
              theme={themeObject}
              color="v"
              opacityLow={opacityLow}
              opacityHigh={opacityHigh}
            />

            <XYControl
              {...coords}
              isDark={isDark([r, g, b, a]) ? '' : 'dark'}
              theme={themeObject}
              onChange={e => {
                this._onXYChange(colorAttribute, e);
              }}
            />
            <div {...theme(4, 'colorModeSlider', `colorModeSlider${colorAttribute.toUpperCase()}`)}>
              <input
                type="range"
                value={colorAttributeValue}
                style={hueSlide}
                onChange={e => {
                  this._onColorSliderChange(colorAttribute, e);
                }}
                min={0}
                max={colorAttributeMax}
              />
            </div>
          </div>

          <div {...theme(5, 'controlsContainer')}>
            <div className="grid mb12">
              <button
                onClick={this.setMode}
                {...theme(
                  6,
                  'buttonMode',
                  'buttonModeFirst',
                  `${this.state.mode === 'rgb' ? 'active' : ''}`
                )}
                value="rgb"
              >
                RGB
              </button>
              <button
                {...theme(
                  7,
                  'buttonMode',
                  'buttonModeLast',
                  `${this.state.mode === 'hsv' ? 'active' : ''}`
                )}
                onClick={this.setMode}
                value="hsv"
              >
                HSV
              </button>
            </div>

            {this.state.mode === 'rgb'
              ? <div>
                  <div
                    {...theme(8, 'inputModeContainer', `${colorAttribute === 'r' ? 'active' : ''}`)}
                  >
                    <ModeInput
                      theme={themeObject}
                      name={this.state.modeInputName}
                      checked={colorAttribute === 'r'}
                      onChange={() => {
                        this.setColorAttribute('r');
                      }}
                    />
                    <RGBInput
                      theme={themeObject}
                      value={r}
                      onChange={e => {
                        this.changeRGB('r', e);
                      }}
                      label="R"
                    />
                  </div>
                  <div
                    {...theme(9, 'inputModeContainer', `${colorAttribute === 'g' ? 'active' : ''}`)}
                  >
                    <ModeInput
                      theme={themeObject}
                      name={this.state.modeInputName}
                      checked={colorAttribute === 'g'}
                      onChange={() => {
                        this.setColorAttribute('g');
                      }}
                    />
                    <RGBInput
                      value={g}
                      theme={themeObject}
                      onChange={e => {
                        this.changeRGB('g', e);
                      }}
                      label="G"
                    />
                  </div>
                  <div
                    {...theme(
                      10,
                      'inputModeContainer',
                      `${colorAttribute === 'b' ? 'active' : ''}`
                    )}
                  >
                    <ModeInput
                      theme={themeObject}
                      name={this.state.modeInputName}
                      checked={colorAttribute === 'b'}
                      onChange={() => {
                        this.setColorAttribute('b');
                      }}
                    />
                    <RGBInput
                      theme={themeObject}
                      value={b}
                      onChange={e => {
                        this.changeRGB('b', e);
                      }}
                      label="B"
                    />
                  </div>
                </div>
              : <div>
                  <div
                    {...theme(
                      10,
                      'inputModeContainer',
                      `${colorAttribute === 'h' ? 'active' : ''}`
                    )}
                  >
                    <ModeInput
                      name={this.state.modeInputName}
                      theme={themeObject}
                      checked={colorAttribute === 'h'}
                      onChange={() => {
                        this.setColorAttribute('h');
                      }}
                    />
                    <HInput
                      value={h}
                      theme={themeObject}
                      onChange={e => {
                        this.changeHSV('h', e);
                      }}
                      label="H"
                    />
                  </div>
                  <div
                    {...theme(
                      11,
                      'inputModeContainer',
                      `${colorAttribute === 's' ? 'active' : ''}`
                    )}
                  >
                    <ModeInput
                      name={this.state.modeInputName}
                      theme={themeObject}
                      checked={colorAttribute === 's'}
                      onChange={() => {
                        this.setColorAttribute('s');
                      }}
                    />
                    <SVAlphaInput
                      value={s}
                      theme={themeObject}
                      onChange={e => {
                        this.changeHSV('s', e);
                      }}
                      label="S"
                    />
                  </div>
                  <div
                    {...theme(
                      12,
                      'inputModeContainer',
                      `${colorAttribute === 'v' ? 'active' : ''}`
                    )}
                  >
                    <ModeInput
                      name={this.state.modeInputName}
                      theme={themeObject}
                      checked={colorAttribute === 'v'}
                      onChange={() => {
                        this.setColorAttribute('v');
                      }}
                    />
                    <SVAlphaInput
                      value={v}
                      theme={themeObject}
                      onChange={e => {
                        this.changeHSV('v', e);
                      }}
                      label="V"
                    />
                  </div>
                </div>}

            <div {...theme(13, 'alphaContainer')}>
              <SVAlphaInput
                value={a}
                theme={themeObject}
                onChange={this.changeAlpha}
                label={String.fromCharCode(945)}
              />
            </div>
            <div {...theme(14, 'tileBackground')}>
              <input
                type="range"
                value={a}
                onChange={this._onAlphaSliderChange}
                style={{ background: opacityGradient }}
                min={0}
                max={100}
              />
            </div>
          </div>
        </div>

        <div {...theme(15, 'bottomWrapper')}>
          <div {...theme(16, 'bottomContainerLeft')}>
            New
            <span {...theme(17, 'tileBackground', 'newSwatchContainer')}>
              <div {...theme(18, 'newSwatch')} style={{ backgroundColor: rgbaBackground }} />
            </span>
            {this.state.reset &&
              <div {...theme(19, 'currentSwatchWrapper')}>
                <span {...theme(19, 'tileBackground', 'currentSwatchContainer')}>
                  <button
                    {...theme(20, 'currentSwatch')}
                    title="Reset color"
                    style={{ backgroundColor: this.state.originalValue }}
                    onClick={this.reset}
                  />
                </span>
                Current
              </div>}
          </div>
          <div {...theme(21, 'bottomContainerRight')}>
            <div {...theme(22, 'hexContainer')}>
              <label {...theme(23, 'numberInputLabel')}>#</label>
              <input
                {...theme(24, 'numberInput')}
                value={hex}
                onChange={this.changeHEX}
                type="text"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ColorPickr;
