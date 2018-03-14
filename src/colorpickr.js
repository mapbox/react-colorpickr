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
import colorString from 'color-string';
import themeable from 'react-themeable';
import { defaultTheme } from './theme';
import { autokey } from './autokey';

import {
  rgbaColor,
  rgb2hsl,
  rgb2hex,
  hsl2rgb,
  colorCoords,
  colorCoordValue,
  getColor,
  isDark
} from './colorfunc';

const isRGBMode = c => c === 'r' || c === 'g' || c === 'b';
const isHSLMode = c => c === 'h' || c === 's' || c === 'l';

class ColorPickr extends React.Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    colorAttribute: PropTypes.string,
    theme: PropTypes.object,
    mode: PropTypes.string,
    initialValue: PropTypes.string,
    reset: PropTypes.bool
  };

  static defaultProps = {
    initialValue: '#000',
    reset: true,
    mode: 'hsl',
    colorAttribute: 'h',
    theme: {}
  };

  constructor(props) {
    super(props);
    const { mode, colorAttribute, initialValue } = props;
    const modeInputName = !process.env.TESTING ? `mode-${Math.random()}` : '';
    this.state = {
      mode,
      modeInputName,
      colorAttribute,
      color: getColor(initialValue)
    };
  }

  emitOnChange(change) {
    const { color, mode, colorAttribute } = this.state;
    this.props.onChange(
      Object.assign({}, color, { mode: mode }, { colorAttribute: colorAttribute }, change)
    );
  }

  toNumber(v) {
    return parseInt(v || 0, 10);
  }

  toString(v) {
    return v.trim();
  }

  changeHSL = (p, e) => {
    const { color } = this.state;
    let j = p;
    if (e) {
      j = {};
      j[p] = this.toNumber(e.target.value);
    }
    const h = 'h' in j ? j.h : color.h;
    const s = 's' in j ? j.s : color.s;
    const l = 'l' in j ? j.l : color.l;
    const rgb = hsl2rgb(h, s, l);
    const hex = rgb2hex(rgb.r, rgb.g, rgb.b);

    const changedColor = Object.assign({}, color, j, rgb, { hex: hex });

    this.setState({ color: changedColor }, () => {
      this.emitOnChange(changedColor);
    });
  };

  changeRGB = (p, e) => {
    const { color } = this.state;
    let j = p;
    if (e) {
      j = {};
      j[p] = this.toNumber(e.target.value);
    }

    const r = 'r' in j ? j.r : color.rl
    const g = 'g' in j ? j.g : color.gl
    const b = 'b' in j ? j.b : color.b;
    const hsl = rgb2hsl(r, g, b);

    const changedColor = Object.assign({}, color, j, hsl, {
      hex: rgb2hex(r, g, b)
    });

    this.setState({ color: changedColor }, () => {
      this.emitOnChange(changedColor);
    });
  };

  changeAlpha = (id, e) => {
    const value = this.toNumber(e.target.value);
    const color = Object.assign({}, this.state.color, { a: value / 100 });
    this.setState({ color: color }, () => {
      this.emitOnChange(color);
    });
  };

  changeHEX = e => {
    const value = this.toString(e.target.value);
    const hex = `#${value}`;
    const isValid = colorString.get(hex);

    const color = getColor(hex) || this.state.color;

    this.setState(
      {
        color: Object.assign({}, color, { hex: value })
      },
      () => {
        if (isValid) this.emitOnChange({ input: 'hex' });
      }
    );
  };

  onBlurHEX = e => {
    const hex = `#${this.toString(e.target.value)}`;

    // If an invalid hex value remains `onBlur`, correct course by calling
    // `getColor` which will return a valid one to us.
    this.setState({ color: getColor(hex) || this.state.color }, this.emitOnChange);
  };

  reset = () => {
    const { initialValue } = this.props;
    this.setState({ color: getColor(initialValue) }, this.emitOnChange);
  };

  onXYChange = (pos) => {
    const { colorAttribute } = this.props;
    const color = colorCoordValue(colorAttribute, pos);
    if (isRGBMode(colorAttribute)) this.changeRGB(color);
    if (isHSLMode(colorAttribute)) this.changeHSL(color);
  };

  onColorSliderChange = (e) => {
    const { colorAttribute } = this.props;
    const value = this.toNumber(e.target.value);
    const color = {};
    color[colorAttribute] = value;
    if (isRGBMode(colorAttribute)) this.changeRGB(color);
    if (isHSLMode(colorAttribute)) this.changeHSL(color);
  }

  onAlphaSliderChange = e => {
    const value = this.toNumber(e.target.value);
    this.changeHSL({
      a: value / 100
    });
  };

  setMode = e => {
    const obj = { mode: e.target.value };
    this.setState(obj, () => {
      this.emitOnChange(obj);
    });
  };

  setColorAttribute = (colorAttribute) => {
    const obj = { colorAttribute };
    this.setState(obj, () => {
      this.emitOnChange(obj);
    });
  }

  render() {
    const { colorAttribute, color, mode } = this.state;
    const { r, g, b, h, s, l, hex } = color;
    const a = Math.round(color.a * 100);

    const themeObject = Object.assign({}, defaultTheme, this.props.theme);
    const theme = autokey(themeable(themeObject));

    const themeRGBGradient = {
      gradient: themeObject.gradient,
      gradientRHigh: themeObject.gradientRHigh,
      gradientRLow: themeObject.gradientRLow,
      gradientGHigh: themeObject.gradientGHigh,
      gradientGLow: themeObject.gradientGLow,
      gradientBHigh: themeObject.gradientBHigh,
      gradientBLow: themeObject.gradientBLow
    };

    const themeNumberInput = {
      numberInputContainer: themeObject.numberInputContainer,
      numberInputLabel: themeObject.numberInputLabel,
      numberInput: themeObject.numberInput
    };

    const themeModeInput = {
      modeInputContainer: themeObject.modeInputContainer,
      modeInput: themeObject.modeInput
    };

    let colorAttributeMax;
    if (isRGBMode(colorAttribute)) {
      colorAttributeMax = 255;
    } else if (colorAttribute === 'h') {
      colorAttributeMax = 360;
    } else {
      colorAttributeMax = 100;
    }

    const rgbaBackground = rgbaColor(r, g, b, a);
    const opacityGradient =
      `linear-gradient(to right, ${rgbaColor(r, g, b, 0)}, ${rgbaColor(r, g, b, 100)})`;

    const hueBackground = `hsl(${h}, 100%, 50%)`;

    // Slider background color for saturation & value.
    const hueSlide = {};
    if (colorAttribute === 'l') {
      hueSlide.background = `linear-gradient(to left, #fff 0%, ${hueBackground} 50%, #000 100%)`;
    } else if (colorAttribute === 's') {
      hueSlide.background = `linear-gradient(to left, ${hueBackground} 0%, #bbb 100%)`;
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

    let modeInputs = (
      <div>
        <div
          {...theme(
            'inputModeContainer',
            `${colorAttribute === 'h' ? 'active' : ''}`
          )}
        >
          <ModeInput
            id="h"
            name={this.state.modeInputName}
            theme={themeModeInput}
            checked={colorAttribute === 'h'}
            onChange={this.setColorAttribute}
          />
          <HInput
            id="h"
            value={h}
            theme={themeNumberInput}
            onChange={this.changeHSL}
          />
        </div>
        <div
          {...theme(
            'inputModeContainer',
            `${colorAttribute === 's' ? 'active' : ''}`
          )}
        >
          <ModeInput
            id="s"
            name={this.state.modeInputName}
            theme={themeModeInput}
            checked={colorAttribute === 's'}
            onChange={this.setColorAttribute}
          />
          <SLAlphaInput
            id="s"
            value={s}
            theme={themeNumberInput}
            onChange={this.changeHSL}
          />
        </div>
        <div
          {...theme(
            'inputModeContainer',
            `${colorAttribute === 'l' ? 'active' : ''}`
          )}
        >
          <ModeInput
            id="l"
            name={this.state.modeInputName}
            theme={themeModeInput}
            checked={colorAttribute === 'l'}
            onChange={this.setColorAttribute}
          />
          <SLAlphaInput
            id="l"
            value={l}
            theme={themeNumberInput}
            onChange={this.changeHSL}
          />
        </div>
      </div>
    );

    if (mode === 'rgb') {
      modeInputs = (
        <div>
          <div
            {...theme('inputModeContainer', `${colorAttribute === 'r' ? 'active' : ''}`)}
          >
            <ModeInput
              id="r"
              theme={themeModeInput}
              name={this.state.modeInputName}
              checked={colorAttribute === 'r'}
              onChange={this.setColorAttribute}
            />
            <RGBInput
              id="r"
              theme={themeNumberInput}
              value={r}
              onChange={this.changeRGB}
            />
          </div>
          <div
            {...theme('inputModeContainer', `${colorAttribute === 'g' ? 'active' : ''}`)}
          >
            <ModeInput
              id="g"
              theme={themeModeInput}
              name={this.state.modeInputName}
              checked={colorAttribute === 'g'}
              onChange={this.setColorAttribute}
            />
            <RGBInput
              id="g"
              value={g}
              theme={themeNumberInput}
              onChange={this.changeRGB}
            />
          </div>
          <div
            {...theme(
              'inputModeContainer',
              `${colorAttribute === 'b' ? 'active' : ''}`
            )}
          >
            <ModeInput
              id="b"
              theme={themeModeInput}
              name={this.state.modeInputName}
              checked={colorAttribute === 'b'}
              onChange={this.setColorAttribute}
            />
            <RGBInput
              id="b"
              theme={themeNumberInput}
              value={b}
              onChange={this.changeRGB}
            />
          </div>
        </div>
      );
    }

    return (
      <div {...theme('container')}>
        <div {...theme('topWrapper')}>
          <div {...theme('gradientContainer')}>
            <XYControl
              {...colorCoords(colorAttribute, color)}
              isDark={isDark([r, g, b]) ? '' : 'dark'}
              theme={{
                xyControlContainer: themeObject.xyControlContainer,
                xyControl: themeObject.xyControl,
                xyControlDark: themeObject.xyControlDark
              }}
              onChange={this.onXYChange}
            >
              <RGBGradient
                active={colorAttribute === 'r'}
                theme={themeRGBGradient}
                color="r"
                opacityLow={opacityLow}
                opacityHigh={opacityHigh}
              />
              <RGBGradient
                active={colorAttribute === 'g'}
                theme={themeRGBGradient}
                color="g"
                opacityLow={opacityLow}
                opacityHigh={opacityHigh}
              />
              <RGBGradient
                active={colorAttribute === 'b'}
                theme={themeRGBGradient}
                color="b"
                opacityLow={opacityLow}
                opacityHigh={opacityHigh}
              />
              <HGradient
                theme={{
                  gradient: themeObject.gradient,
                  gradientHue: themeObject.gradientHue
                }}
                active={colorAttribute === 'h'}
                hueBackground={hueBackground}
              />
              <SGradient
                theme={{
                  gradient: themeObject.gradient,
                  gradientSaturation: themeObject.gradientSaturation
                }}
                active={colorAttribute === 's'}
                opacityLow={opacityLow}
                opacityHigh={opacityHigh}
              />
              <LGradient
                theme={{
                  gradient: themeObject.gradient,
                  gradientLight: themeObject.gradientLight
                }}
                active={colorAttribute === 'l'}
                opacityLow={opacityLow}
                opacityHigh={opacityHigh}
              />
            </XYControl>
            <div {...theme('slider', 'colorModeSlider', `colorModeSlider${colorAttribute.toUpperCase()}`)}>
              <input
                type="range"
                value={color[colorAttribute]}
                style={hueSlide}
                onChange={this.onColorSliderChange}
                min={0}
                max={colorAttributeMax}
              />
            </div>
            <div {...theme('slider', 'tileBackground')}>
              <input
                type="range"
                value={a}
                onChange={this.onAlphaSliderChange}
                style={{ background: opacityGradient }}
                min={0}
                max={100}
              />
            </div>
          </div>
          <div {...theme('controlsContainer')}>
            <div {...theme('toggleGroup')}>
              <label {...theme('toggleContainer')}>
                <input
                  data-test="mode-hsl"
                  checked={this.state.mode === 'hsl'}
                  onChange={this.setMode}
                  value="hsl"
                  name="toggle"
                  type="radio"
                />
                <div {...theme('toggle')}>HSL</div>
              </label>
              <label {...theme('toggleContainer')}>
                <input
                  data-test="mode-rgb"
                  checked={this.state.mode === 'rgb'}
                  onChange={this.setMode}
                  value="rgb"
                  name="toggle"
                  type="radio"
                />
                <div {...theme('toggle')}>RGB</div>
              </label>
            </div>
            {modeInputs}
            <div {...theme('alphaContainer')}>
              <SLAlphaInput
                id={String.fromCharCode(945)}
                value={a}
                theme={themeNumberInput}
                onChange={this.changeAlpha}
              />
            </div>
          </div>
        </div>
        <div {...theme('bottomWrapper')}>
          <div {...theme('swatchCompareContainer')}>
            {this.props.reset &&
              <div {...theme('tileBackground', 'currentSwatchContainer')}>
                <button
                  {...theme('swatch', 'currentSwatch')}
                  title="Reset color"
                  style={{ backgroundColor: this.props.initialValue }}
                  onClick={this.reset}
                >
                  Reset
                </button>
              </div>}
            <div {...theme('tileBackground', 'newSwatchContainer')}>
              <div {...theme('swatch')} style={{ backgroundColor: rgbaBackground }} />
            </div>
          </div>
          <div {...theme('hexContainer')}>
            <label {...theme('numberInputLabel')}>#</label>
            <input
              {...theme('numberInput')}
              data-test="hex-input"
              value={hex}
              onChange={this.changeHEX}
              onBlur={this.onBlurHEX}
              type="text"
            />
          </div>
        </div>
      </div>
    );
  }
}

export default ColorPickr;
