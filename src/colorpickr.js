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
  container: 'colorpickr round inline-block bg-gray-faint w240 round px12 py12 txt-xs',
  gradientContainer: 'z1 w-full h180 pr12 mb12 relative',
  controlsContainer: 'grid grid--gut12',
  controlsLeftContainer: 'col col--5',
  controlsRightContainer: 'col col--7',
  buttonModeContainer: 'grid mb12',
  buttonMode: 'col col--6 btn btn--gray-light h24 py0',
  buttonModeFirst: 'round-l',
  buttonModeLast: 'round-r',
  inputModeContainer: 'mt3 flex-parent',
  alphaContainer: 'mt3',
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
  numberInputLabel: 'absolute top left bottom pl6 flex-parent flex-parent--center-cross color-gray-light txt-bold',
  numberInput: 'w-full pl18 pr3 input input--s txt-mono txt-xs bg-white',
  modeInputContainer: 'flex-child flex-child--no-shrink flex-parent flex-parent--center-cross w24',
  modeInput: 'cursor-pointer',
  swatch: 'w-full h-full',
  swatchCompareContainer: 'grid h24 mb12',
  currentSwatchContainer: 'col col--6 round-l clip border-r border--gray-faint',
  currentSwatch: 'txt-bold align-center color-transparent color-white-on-hover transition',
  newSwatchContainer: 'col col--6 round-r clip',
  hexContainer: 'relative mb12 pb3'
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
    const modeInputName = !process.env.TESTING ? `mode-${Math.random()}` : '';
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

    const RGBGradientTheme = {
      gradient: themeObject.gradient,
      gradientRHigh: themeObject.gradientRHigh,
      gradientRLow: themeObject.gradientRLow,
      gradientGHigh: themeObject.gradientGHigh,
      gradientGLow: themeObject.gradientGLow,
      gradientBHigh: themeObject.gradientBHigh,
      gradientBLow: themeObject.gradientBlow
    };

    const HGradientTheme = {
      gradient: themeObject.gradient,
      gradientLightLeft: themeObject.gradientLightLeft,
      gradientDarkBottom: themeObject.gradientDarkBottom
    };

    const SVGradientTheme = {
      gradient: themeObject.gradient,
      gradientSHigh: themeObject.gradientSHigh,
      gradientSLow: themeObject.gradientSLow,
      gradientVHigh: themeObject.gradientVHigh,
      gradientVLow: themeObject.gradientVLow,
      gradientDarkBottom: themeObject.gradientDarkBottom,
      gradientLightBottom: themeObject.gradientLightBottom
    };

    const XYControlTheme = {
      xyControlContainer: themeObject.xyControlContainer,
      xyControl: themeObject.xyControl,
      xyControlDark: themeObject.xyControlDark
    };

    const numberInputTheme = {
      numberInputContainer: themeObject.numberInputContainer,
      numberInputLabel: themeObject.numberInputLabel,
      numberInput: themeObject.numberInput
    };

    const modeInputTheme = {
      modeInputContainer: themeObject.modeInputContainer,
      modeInput: themeObject.modeInput
    };

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
        <div {...theme(2, 'gradientContainer')}>
          <RGBGradient
            active={colorAttribute === 'r'}
            theme={RGBGradientTheme}
            color="r"
            opacityLow={opacityLow}
            opacityHigh={opacityHigh}
          />
          <RGBGradient
            active={colorAttribute === 'g'}
            theme={RGBGradientTheme}
            color="g"
            opacityLow={opacityLow}
            opacityHigh={opacityHigh}
          />
          <RGBGradient
            active={colorAttribute === 'b'}
            theme={RGBGradientTheme}
            color="b"
            opacityLow={opacityLow}
            opacityHigh={opacityHigh}
          />

          <HGradient
            theme={HGradientTheme}
            active={colorAttribute === 'h'}
            hueBackground={hueBackground}
          />
          <SVGradient
            active={colorAttribute === 's'}
            theme={SVGradientTheme}
            color="s"
            opacityLow={opacityLow}
            opacityHigh={opacityHigh}
          />
          <SVGradient
            active={colorAttribute === 'v'}
            theme={SVGradientTheme}
            color="v"
            opacityLow={opacityLow}
            opacityHigh={opacityHigh}
          />

          <XYControl
            {...coords}
            isDark={isDark([r, g, b, a]) ? '' : 'dark'}
            theme={XYControlTheme}
            onChange={e => {
              this._onXYChange(colorAttribute, e);
            }}
          />
          <div {...theme(3, 'colorModeSlider', `colorModeSlider${colorAttribute.toUpperCase()}`)}>
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

        <div {...theme(4, 'controlsContainer')}>
          <div {...theme(5, 'controlsLeftContainer')}>
            <div {...theme(6, 'buttonModeContainer')}>
              <button
                data-test="button-mode-rgb"
                onClick={this.setMode}
                {...theme(
                  7,
                  'buttonMode',
                  'buttonModeFirst',
                  `${this.state.mode === 'rgb' ? 'active' : ''}`
                )}
                value="rgb"
              >
                RGB
              </button>
              <button
                data-test="button-mode-hsv"
                onClick={this.setMode}
                {...theme(
                  8,
                  'buttonMode',
                  'buttonModeLast',
                  `${this.state.mode === 'hsv' ? 'active' : ''}`
                )}
                value="hsv"
              >
                HSV
              </button>
            </div>

            {this.state.mode === 'rgb'
            ? <div>
                <div
                  {...theme(9, 'inputModeContainer', `${colorAttribute === 'r' ? 'active' : ''}`)}
                >
                  <ModeInput
                    theme={modeInputTheme}
                    name={this.state.modeInputName}
                    checked={colorAttribute === 'r'}
                    onChange={() => {
                      this.setColorAttribute('r');
                    }}
                  />
                  <RGBInput
                    theme={numberInputTheme}
                    value={r}
                    onChange={e => {
                      this.changeRGB('r', e);
                    }}
                    label="R"
                  />
                </div>
                <div
                  {...theme(10, 'inputModeContainer', `${colorAttribute === 'g' ? 'active' : ''}`)}
                >
                  <ModeInput
                    theme={modeInputTheme}
                    name={this.state.modeInputName}
                    checked={colorAttribute === 'g'}
                    onChange={() => {
                      this.setColorAttribute('g');
                    }}
                  />
                  <RGBInput
                    value={g}
                    theme={numberInputTheme}
                    onChange={e => {
                      this.changeRGB('g', e);
                    }}
                    label="G"
                  />
                </div>
                <div
                  {...theme(
                    11,
                    'inputModeContainer',
                    `${colorAttribute === 'b' ? 'active' : ''}`
                  )}
                >
                  <ModeInput
                    theme={modeInputTheme}
                    name={this.state.modeInputName}
                    checked={colorAttribute === 'b'}
                    onChange={() => {
                      this.setColorAttribute('b');
                    }}
                  />
                  <RGBInput
                    theme={numberInputTheme}
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
                    12,
                    'inputModeContainer',
                    `${colorAttribute === 'h' ? 'active' : ''}`
                  )}
                >
                  <ModeInput
                    name={this.state.modeInputName}
                    theme={modeInputTheme}
                    checked={colorAttribute === 'h'}
                    onChange={() => {
                      this.setColorAttribute('h');
                    }}
                  />
                  <HInput
                    value={h}
                    theme={numberInputTheme}
                    onChange={e => {
                      this.changeHSV('h', e);
                    }}
                    label="H"
                  />
                </div>
                <div
                  {...theme(
                    13,
                    'inputModeContainer',
                    `${colorAttribute === 's' ? 'active' : ''}`
                  )}
                >
                  <ModeInput
                    name={this.state.modeInputName}
                    theme={modeInputTheme}
                    checked={colorAttribute === 's'}
                    onChange={() => {
                      this.setColorAttribute('s');
                    }}
                  />
                  <SVAlphaInput
                    value={s}
                    theme={numberInputTheme}
                    onChange={e => {
                      this.changeHSV('s', e);
                    }}
                    label="S"
                  />
                </div>
                <div
                  {...theme(
                    14,
                    'inputModeContainer',
                    `${colorAttribute === 'v' ? 'active' : ''}`
                  )}
                >
                  <ModeInput
                    name={this.state.modeInputName}
                    theme={modeInputTheme}
                    checked={colorAttribute === 'v'}
                    onChange={() => {
                      this.setColorAttribute('v');
                    }}
                  />
                  <SVAlphaInput
                    value={v}
                    theme={numberInputTheme}
                    onChange={e => {
                      this.changeHSV('v', e);
                    }}
                    label="V"
                  />
                </div>
              </div>}
          </div>
          <div {...theme(15, 'controlsRightContainer')}>
            <div {...theme(16, 'swatchCompareContainer')}>
              {this.state.reset &&
                <div {...theme(17, 'tileBackground', 'currentSwatchContainer')}>
                  <button
                    {...theme(18, 'swatch', 'currentSwatch')}
                    title="Reset color"
                    style={{ backgroundColor: this.state.originalValue }}
                    onClick={this.reset}
                  >
                    Reset
                  </button>
                </div>}
              <div {...theme(19, 'tileBackground', 'newSwatchContainer')}>
                <div {...theme(20, 'swatch')} style={{ backgroundColor: rgbaBackground }} />
              </div>
            </div>
            <div {...theme(21, 'hexContainer')}>
              <label {...theme(22, 'numberInputLabel')}>#</label>
              <input
                {...theme(23, 'numberInput')}
                value={hex}
                onChange={this.changeHEX}
                type="text"
              />
            </div>
            <div {...theme(24, 'tileBackground')}>
              <input
                type="range"
                value={a}
                onChange={this._onAlphaSliderChange}
                style={{ background: opacityGradient }}
                min={0}
                max={100}
              />
            </div>
            <div {...theme(25, 'alphaContainer')}>
              <SVAlphaInput
                value={a}
                theme={numberInputTheme}
                onChange={this.changeAlpha}
                label={String.fromCharCode(945)}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ColorPickr;
