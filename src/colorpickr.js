'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import XYControl from './xy';
import ModeInput from './components/inputs/mode-input';
import RGBInput from './components/inputs/rgb-input';
import HInput from './components/inputs/h-input';
import SLAlphaInput from './components/inputs/sl-alpha-input';
import RGBGradient from './components/gradients/rgb-gradient';
import HGradient from './components/gradients/h-gradient';
import SGradient from './components/gradients/s-gradient';
import LGradient from './components/gradients/l-gradient';
import tinyColor from 'tinycolor2';
import themeable from 'react-themeable';

import {
  rgbaColor,
  rgb2hsl,
  rgb2hex,
  hsl2hex,
  hsl2rgb,
  colorCoords,
  colorCoordValue,
  getColor,
  isDark
} from './colorfunc';

const isRGBMode = c => c === 'r' || c === 'g' || c === 'b';
const isHSLMode = c => c === 'h' || c === 's' || c === 'l';

const defaultTheme = {
  container: 'colorpickr round inline-block bg-gray-faint w240 round px12 py12 txt-xs',
  gradientContainer: 'z1 w-full h180 pr24 mb12 relative',
  controlsContainer: 'grid grid--gut12',
  controlsLeftContainer: 'col col--6',
  controlsRightContainer: 'col col--6',
  toggleGroup: 'toggle-group round-full border border--gray-light py3 px3 mb12 w-full',
  toggleContainer: 'toggle-container w-full',
  toggle: 'toggle txt-xs py0 round-full toggle--gray',
  inputModeContainer: 'mb3 flex-parent',
  alphaContainer: 'mb3',
  tileBackground: 'bg-tile bg-white',
  active: 'is-active',
  slider: 'slider',
  colorModeSlider: 'colormode-slider',
  colorModeSliderR: 'colormode-slider-r',
  colorModeSliderG: 'colormode-slider-g',
  colorModeSliderB: 'colormode-slider-b',
  colorModeSliderH: 'colormode-slider-h',
  gradient: 'absolute top right bottom left',
  gradientHue: 'gradient-hue',
  gradientSaturation: 'gradient-saturation',
  gradientLight: 'gradient-light',
  gradientRHigh: 'gradient-rgb gradient-r-high',
  gradientRLow: 'gradient-rgb gradient-r-low',
  gradientGHigh: 'gradient-rgb gradient-g-high',
  gradientGLow: 'gradient-rgb gradient-g-low',
  gradientBHigh: 'gradient-rgb gradient-b-high',
  gradientBLow: 'gradient-rgb gradient-b-low',
  xyControlContainer: 'relative w-full h-full cursor-pointer',
  xyControl: 'xy-control absolute z1 unselectable cursor-move',
  xyControlDark: 'xy-control-dark',
  numberInputContainer: 'flex-child flex-child--grow relative',
  numberInputLabel: 'absolute top left bottom pl6 flex-parent flex-parent--center-cross color-gray-light txt-bold',
  numberInput: 'w-full pl18 pr3 input input--s txt-mono txt-xs bg-white',
  modeInputContainer: 'flex-child flex-child--no-shrink flex-parent flex-parent--center-cross w24',
  modeInput: 'cursor-pointer',
  swatch: 'w-full h-full',
  swatchCompareContainer: 'grid h24',
  currentSwatchContainer: 'col col--6 round-l clip border-r border--gray-faint',
  currentSwatch: 'txt-bold align-center color-transparent color-white-on-hover transition',
  newSwatchContainer: 'col col--6 round-r clip',
  hexContainer: 'relative mb3'
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
    mode: 'hsl',
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

  changeHSL = (p, e) => {
    const color = this.state.color;
    let j = p;
    if (typeof j === 'string') {
      j = {};
      j[p] = Math.floor(parseInt(e.target.value || 0, 10));
    }
    const h = 'h' in j ? j.h : color.h,
      s = 's' in j ? j.s : color.s,
      l = 'l' in j ? j.l : color.l;
    const rgb = hsl2rgb(h, s, l);
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
    const hsl = rgb2hsl(r, g, b);

    const changedColor = Object.assign({}, color, j, hsl, {
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
        color: Object.assign({}, color, { hex: e.target.value.trim() })
      },
      () => {
        if (isValid) this.emitOnChange({ input: 'hex' });
      }
    );
  };

  onBlurHEX = e => {
    const hex = '#' + e.target.value.trim();

    // If an invalid hex value remains `onBlur`, correct course by calling
    // `getColor` which will return a valid one to us.
    this.setState({ color: getColor(hex) || this.state.color }, this.emitOnChange);
  };

  reset = () => {
    this.setState({ color: getColor(this.state.originalValue) }, this.emitOnChange);
  };

  _onXYChange = (mode, pos) => {
    const color = colorCoordValue(mode, pos);
    if (isRGBMode(mode)) this.changeRGB(color);
    if (isHSLMode(mode)) this.changeHSL(color);
  };

  _onColorSliderChange(mode, e) {
    const color = {};
    color[mode] = parseFloat(e.target.value);
    if (isRGBMode(mode)) this.changeRGB(color);
    if (isHSLMode(mode)) this.changeHSL(color);
  }

  _onAlphaSliderChange = e => {
    this.changeHSL({
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
      gradientBLow: themeObject.gradientBLow
    };

    const HGradientTheme = {
      gradient: themeObject.gradient,
      gradientHue: themeObject.gradientHue
    };

    const SGradientTheme = {
      gradient: themeObject.gradient,
      gradientSaturation: themeObject.gradientSaturation
    };

    const LGradientTheme = {
      gradient: themeObject.gradient,
      gradientLight: themeObject.gradientLight
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
    const { r, g, b, h, s, l, hex } = color;

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

    const hueBackground = '#' + hsl2hex(h, 100, 50);
    const coords = colorCoords(colorAttribute, color);

    // Slider background color for saturation & value.
    const hueSlide = {};
    if (colorAttribute === 'l') {
      hueSlide.background = 'linear-gradient(to left, #fff 0%, ' + hueBackground + ' 50%, #000 100%)';
    } else if (colorAttribute === 's') {
      hueSlide.background = 'linear-gradient(to left, ' + hueBackground + ' 0%, #bbb 100%)';
    }

    // Opacity between colorspaces in RGB & SL
    let opacityHigh = 0;
    let opacityLow = 0;

    if (['r', 'g', 'b'].indexOf(colorAttribute) >= 0) {
      opacityHigh = Math.round(color[colorAttribute] / 255 * 100) / 100;
      opacityLow = Math.round(100 - color[colorAttribute] / 255 * 100) / 100;
    } else if (['s', 'l'].indexOf(colorAttribute) >= 0) {
      opacityHigh = Math.round(color[colorAttribute] / 100 * 100) / 100;
      opacityLow = Math.round(100 - color[colorAttribute] / 100 * 100) / 100;
    }

    return (
      <div {...theme(318, 'container')}>
        <div {...theme(319, 'gradientContainer')}>
          <XYControl
            {...coords}
            isDark={isDark([r, g, b]) ? '' : 'dark'}
            theme={XYControlTheme}
            onChange={e => {
              this._onXYChange(colorAttribute, e);
            }}
          >
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
            <SGradient
              active={colorAttribute === 's'}
              theme={SGradientTheme}
              opacityLow={opacityLow}
              opacityHigh={opacityHigh}
            />
            <LGradient
              active={colorAttribute === 'l'}
              theme={LGradientTheme}
              opacityLow={opacityLow}
              opacityHigh={opacityHigh}
            />
          </XYControl>
          <div {...theme(370, 'slider', 'colorModeSlider', `colorModeSlider${colorAttribute.toUpperCase()}`)}>
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
          <div {...theme(384, 'slider', 'tileBackground')}>
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
        <div {...theme(393, 'toggleGroup')}>
          <label {...theme(404, 'toggleContainer')}>
            <input
              data-test="mode-hsl"
              checked={this.state.mode === 'hsl'}
              onChange={this.setMode}
              value="hsl"
              name="toggle"
              type="radio"
            />
            <div {...theme(412, 'toggle')}>HSL</div>
          </label>
          <label {...theme(394, 'toggleContainer')}>
            <input
              data-test="mode-rgb"
              checked={this.state.mode === 'rgb'}
              onChange={this.setMode}
              value="rgb"
              name="toggle"
              type="radio"
            />
            <div {...theme(402, 'toggle')}>RGB</div>
          </label>
        </div>
        <div {...theme(424, 'controlsContainer')}>
          <div {...theme(425, 'controlsLeftContainer')}>
            {this.state.mode === 'rgb'
            ? <div>
                <div
                  {...theme(430, 'inputModeContainer', `${colorAttribute === 'r' ? 'active' : ''}`)}
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
                  {...theme(450, 'inputModeContainer', `${colorAttribute === 'g' ? 'active' : ''}`)}
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
                    471,
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
                    497,
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
                      this.changeHSL('h', e);
                    }}
                    label="H"
                  />
                </div>
                <div
                  {...theme(
                    521,
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
                  <SLAlphaInput
                    value={s}
                    theme={numberInputTheme}
                    onChange={e => {
                      this.changeHSL('s', e);
                    }}
                    label="S"
                  />
                </div>
                <div
                  {...theme(
                    545,
                    'inputModeContainer',
                    `${colorAttribute === 'l' ? 'active' : ''}`
                  )}
                >
                  <ModeInput
                    name={this.state.modeInputName}
                    theme={modeInputTheme}
                    checked={colorAttribute === 'l'}
                    onChange={() => {
                      this.setColorAttribute('l');
                    }}
                  />
                  <SLAlphaInput
                    value={l}
                    theme={numberInputTheme}
                    onChange={e => {
                      this.changeHSL('l', e);
                    }}
                    label="L"
                  />
                </div>
              </div>}
          </div>
          <div {...theme(569, 'controlsRightContainer')}>
            <div {...theme(570, 'hexContainer')}>
              <label {...theme(571, 'numberInputLabel')}>#</label>
              <input
                {...theme(573, 'numberInput')}
                data-test="hex-input"
                value={hex}
                onChange={this.changeHEX}
                onBlur={this.onBlurHEX}
                type="text"
              />
            </div>
            <div {...theme(579, 'alphaContainer')}>
              <SLAlphaInput
                value={a}
                theme={numberInputTheme}
                onChange={this.changeAlpha}
                label={String.fromCharCode(945)}
              />
            </div>
            <div {...theme(587, 'swatchCompareContainer')}>
              {this.state.reset &&
                <div {...theme(589, 'tileBackground', 'currentSwatchContainer')}>
                  <button
                    {...theme(591, 'swatch', 'currentSwatch')}
                    title="Reset color"
                    style={{ backgroundColor: this.state.originalValue }}
                    onClick={this.reset}
                  >
                    Reset
                  </button>
                </div>}
              <div {...theme(599, 'tileBackground', 'newSwatchContainer')}>
                <div {...theme(600, 'swatch')} style={{ backgroundColor: rgbaBackground }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ColorPickr;
