import React from 'react';
import PropTypes from 'prop-types';
import { XYControl } from './xy';
import { ModeInput } from './components/inputs/mode-input';
import { RGBInput } from './components/inputs/rgb-input';
import { HInput } from './components/inputs/h-input';
import { SLAlphaInput } from './components/inputs/sl-alpha-input';
import { RGBGradient } from './components/gradients/rgb-gradient';
import { HGradient } from './components/gradients/h-gradient';
import { SGradient } from './components/gradients/s-gradient';
import { LGradient } from './components/gradients/l-gradient';
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

const isRGBChannel = (c) => ['r', 'g', 'b'].includes(c);
const isHSLChannel = (c) => ['h', 's', 'l'].includes(c);
const toNumber = (v) => parseInt(v || 0, 10);
const normalizeString = (v) => {
  // Normalize to string and drop a leading hash if provided.
  return v.trim().replace(/^#/, '');
};

class ColorPickr extends React.Component {
  // eslint-disable-next-line no-undef
  modeInputName = !process.env.TESTING ? `mode-${Math.random()}` : '';
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    mounted: PropTypes.func,
    channel: PropTypes.string,
    theme: PropTypes.object,
    mode: PropTypes.string,
    initialValue: PropTypes.string,
    reset: PropTypes.bool,
    alpha: PropTypes.bool,
    readOnly: PropTypes.bool
  };

  static defaultProps = {
    initialValue: '#000',
    alpha: true,
    reset: true,
    mode: 'hsl',
    channel: 'h',
    theme: {},
    readOnly: false
  };

  assignColor(v) {
    const { alpha } = this.props;
    let color = getColor(v);
    if (!alpha && color.a < 1) {
      console.warn(
        `[ColorPickr] ${v} contains an alpha channel "${color.a}" but alpha is set to "false". Resetting to "1".`
      );
      color = { ...color, ...{ a: 1 } };
    }

    return color;
  }

  constructor(props) {
    super(props);
    const { mode, channel, initialValue } = props;
    const color = this.assignColor(initialValue);

    this.state = {
      mode,
      channel,
      initialValue: color,
      color
    };
  }

  componentDidMount() {
    const { mounted } = this.props;
    if (mounted) {
      mounted(this);
    }
  }

  overrideValue = (cssColor, shouldUpdateInitialValue) => {
    const color = this.assignColor(cssColor);
    const state = { color };

    if (shouldUpdateInitialValue) {
      state.initialValue = color;
    }

    this.setState(state, this.emitOnChange);
  };

  emitOnChange = (hexInput) => {
    const { color, mode, channel } = this.state;
    this.props.onChange({ hexInput: !!hexInput, mode, channel, ...color });
  };

  setNextColor = (obj) => {
    const { color } = this.state;
    this.setState(
      {
        color: { ...color, ...obj }
      },
      this.emitOnChange
    );
  };

  changeHSL = (p, inputValue) => {
    const { color } = this.state;
    let j = p;
    if (inputValue !== undefined) {
      j = {};
      j[p] = inputValue;
    }
    const h = 'h' in j ? j.h : color.h;
    const s = 's' in j ? j.s : color.s;
    const l = 'l' in j ? j.l : color.l;
    const rgb = hsl2rgb(h, s, l);
    const hex = rgb2hex(rgb.r, rgb.g, rgb.b);
    this.setNextColor({ ...j, ...rgb, ...{ hex } });
  };

  changeRGB = (p, inputValue) => {
    const { color } = this.state;
    let j = p;
    if (inputValue !== undefined) {
      j = {};
      j[p] = inputValue;
    }
    const r = 'r' in j ? j.r : color.r;
    const g = 'g' in j ? j.g : color.g;
    const b = 'b' in j ? j.b : color.b;
    const hsl = rgb2hsl(r, g, b);
    const hex = rgb2hex(r, g, b);
    this.setNextColor({ ...j, ...hsl, ...{ hex } });
  };

  changeAlpha = (_, v) => {
    this.setNextColor({ a: v / 100 });
  };

  changeHEX = (e) => {
    const value = normalizeString(e.target.value);
    const hex = `#${value}`;
    const isValid = colorString.get(hex);
    const color = this.assignColor(hex) || this.state.color;
    const nextColor = { ...color, ...{ hex: value } };
    this.setState({ color: nextColor }, () => {
      if (isValid) this.emitOnChange(true);
    });
  };

  onBlurHEX = (e) => {
    const hex = `#${normalizeString(e.target.value)}`;

    // If an invalid hex value remains `onBlur`, correct course by calling
    // `getColor` which will return a valid one to us.
    const nextColor = this.assignColor(hex) || this.state.color;
    this.setState({ color: nextColor }, this.emitOnChange.bind(this, true));
  };

  reset = () => {
    const { initialValue } = this.state;
    this.setState({ color: initialValue }, this.emitOnChange);
  };

  onXYChange = (pos) => {
    const { channel } = this.state;
    const color = colorCoordValue(channel, pos);
    if (isRGBChannel(channel)) this.changeRGB(color);
    if (isHSLChannel(channel)) this.changeHSL(color);
  };

  onColorSliderChange = (e) => {
    const { channel } = this.state;
    const value = toNumber(e.target.value);
    const color = {};
    color[channel] = value;
    if (isRGBChannel(channel)) this.changeRGB(color);
    if (isHSLChannel(channel)) this.changeHSL(color);
  };

  onAlphaSliderChange = (e) => {
    const value = toNumber(e.target.value);
    this.changeHSL({
      a: value / 100
    });
  };

  setMode = (e) => {
    const mode = e.target.value;
    this.setState({ mode }, this.emitOnChange);
  };

  setChannel = (channel) => {
    this.setState({ channel }, this.emitOnChange);
  };

  render() {
    const { channel, color, mode, initialValue: i } = this.state;
    const { r, g, b, h, s, l, hex } = color;
    const { theme, readOnly, reset, alpha } = this.props;
    const a = Math.round(color.a * 100);
    const themeObject = { ...defaultTheme, ...theme };

    if (!readOnly) {
      themeObject.numberInput = `${themeObject.numberInput} bg-white`;
    } else {
      themeObject.xyControlContainer = `${themeObject.xyControlContainer} events-none`;
    }

    const themer = autokey(themeable(themeObject));

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

    let channelMax;
    if (isRGBChannel(channel)) {
      channelMax = 255;
    } else if (channel === 'h') {
      channelMax = 360;
    } else {
      channelMax = 100;
    }

    const rgbaBackground = rgbaColor(r, g, b, a);
    const opacityGradient = `linear-gradient(
      to right,
      ${rgbaColor(r, g, b, 0)},
      ${rgbaColor(r, g, b, 100)}
    )`;

    const hueBackground = `hsl(${h}, 100%, 50%)`;

    // Slider background color for saturation & value.
    const hueSlide = {};
    if (channel === 'l') {
      hueSlide.background = `linear-gradient(to left, #fff 0%, ${hueBackground} 50%, #000 100%)`;
    } else if (channel === 's') {
      hueSlide.background = `linear-gradient(to left, ${hueBackground} 0%, #bbb 100%)`;
    }

    // Opacity between colorspaces in RGB & SL
    let opacityHigh = 0;
    let opacityLow = 0;

    if (isRGBChannel(channel)) {
      opacityHigh = Math.round((color[channel] / 255) * 100) / 100;
      opacityLow = Math.round(100 - (color[channel] / 255) * 100) / 100;
    } else if (['s', 'l'].includes(channel)) {
      opacityHigh = Math.round((color[channel] / 100) * 100) / 100;
      opacityLow = Math.round(100 - (color[channel] / 100) * 100) / 100;
    }

    let modeInputs = (
      <div>
        <div
          {...themer(
            'inputModeContainer',
            `${channel === 'h' ? 'active' : ''}`
          )}
        >
          <ModeInput
            name={this.modeInputName}
            theme={themeModeInput}
            checked={channel === 'h'}
            onChange={() => this.setChannel('h')}
            {...(readOnly ? { readOnly: true } : {})}
          />
          <HInput
            id="h"
            value={h}
            theme={themeNumberInput}
            onChange={this.changeHSL}
            {...(readOnly ? { readOnly: true } : {})}
          />
        </div>
        <div
          {...themer(
            'inputModeContainer',
            `${channel === 's' ? 'active' : ''}`
          )}
        >
          <ModeInput
            name={this.modeInputName}
            theme={themeModeInput}
            checked={channel === 's'}
            onChange={() => this.setChannel('s')}
            {...(readOnly ? { readOnly: true } : {})}
          />
          <SLAlphaInput
            id="s"
            value={s}
            theme={themeNumberInput}
            onChange={this.changeHSL}
            {...(readOnly ? { readOnly: true } : {})}
          />
        </div>
        <div
          {...themer(
            'inputModeContainer',
            `${channel === 'l' ? 'active' : ''}`
          )}
        >
          <ModeInput
            name={this.modeInputName}
            theme={themeModeInput}
            checked={channel === 'l'}
            onChange={() => this.setChannel('l')}
            {...(readOnly ? { readOnly: true } : {})}
          />
          <SLAlphaInput
            id="l"
            value={l}
            theme={themeNumberInput}
            onChange={this.changeHSL}
            {...(readOnly ? { readOnly: true } : {})}
          />
        </div>
      </div>
    );

    if (mode === 'rgb') {
      modeInputs = (
        <div>
          <div
            {...themer(
              'inputModeContainer',
              `${channel === 'r' ? 'active' : ''}`
            )}
          >
            <ModeInput
              theme={themeModeInput}
              name={this.modeInputName}
              checked={channel === 'r'}
              onChange={() => this.setChannel('r')}
              {...(readOnly ? { readOnly: true } : {})}
            />
            <RGBInput
              id="r"
              theme={themeNumberInput}
              value={r}
              onChange={this.changeRGB}
              {...(readOnly ? { readOnly: true } : {})}
            />
          </div>
          <div
            {...themer(
              'inputModeContainer',
              `${channel === 'g' ? 'active' : ''}`
            )}
          >
            <ModeInput
              theme={themeModeInput}
              name={this.modeInputName}
              checked={channel === 'g'}
              onChange={() => this.setChannel('g')}
              {...(readOnly ? { readOnly: true } : {})}
            />
            <RGBInput
              id="g"
              value={g}
              theme={themeNumberInput}
              onChange={this.changeRGB}
              {...(readOnly ? { readOnly: true } : {})}
            />
          </div>
          <div
            {...themer(
              'inputModeContainer',
              `${channel === 'b' ? 'active' : ''}`
            )}
          >
            <ModeInput
              theme={themeModeInput}
              name={this.modeInputName}
              checked={channel === 'b'}
              onChange={() => this.setChannel('b')}
              {...(readOnly ? { readOnly: true } : {})}
            />
            <RGBInput
              id="b"
              theme={themeNumberInput}
              value={b}
              onChange={this.changeRGB}
              {...(readOnly ? { readOnly: true } : {})}
            />
          </div>
        </div>
      );
    }

    return (
      <div {...themer('container')}>
        <div {...themer('topWrapper')}>
          <div {...themer('gradientContainer')}>
            <XYControl
              {...colorCoords(channel, color)}
              isDark={isDark([r, g, b])}
              theme={{
                xyControlContainer: themeObject.xyControlContainer,
                xyControl: themeObject.xyControl,
                xyControlDark: themeObject.xyControlDark
              }}
              onChange={this.onXYChange}
            >
              <RGBGradient
                active={channel === 'r'}
                theme={themeRGBGradient}
                color="r"
                opacityLow={opacityLow}
                opacityHigh={opacityHigh}
              />
              <RGBGradient
                active={channel === 'g'}
                theme={themeRGBGradient}
                color="g"
                opacityLow={opacityLow}
                opacityHigh={opacityHigh}
              />
              <RGBGradient
                active={channel === 'b'}
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
                active={channel === 'h'}
                hueBackground={hueBackground}
              />
              <SGradient
                theme={{
                  gradient: themeObject.gradient,
                  gradientSaturation: themeObject.gradientSaturation
                }}
                active={channel === 's'}
                opacityLow={opacityLow}
                opacityHigh={opacityHigh}
              />
              <LGradient
                theme={{
                  gradient: themeObject.gradient,
                  gradientLight: themeObject.gradientLight
                }}
                active={channel === 'l'}
                opacityLow={opacityLow}
                opacityHigh={opacityHigh}
              />
            </XYControl>
            <div
              {...themer(
                'slider',
                'colorModeSlider',
                `colorModeSlider${channel.toUpperCase()}`
              )}
            >
              <input
                {...(readOnly ? { disabled: true } : {})}
                data-testid="color-slider"
                type="range"
                value={color[channel]}
                style={hueSlide}
                onChange={this.onColorSliderChange}
                min={0}
                max={channelMax}
              />
            </div>
            {alpha && (
              <div {...themer('slider', 'tileBackground')}>
                <input
                  {...(readOnly ? { disabled: true } : {})}
                  data-testid="alpha-slider"
                  type="range"
                  value={a}
                  onChange={this.onAlphaSliderChange}
                  style={{ background: opacityGradient }}
                  min={0}
                  max={100}
                />
              </div>
            )}
          </div>
          <div {...themer('controlsContainer')}>
            <div {...themer('toggleGroup')}>
              <label {...themer('toggleContainer')}>
                <input
                  data-testid="mode-hsl"
                  checked={this.state.mode === 'hsl'}
                  onChange={this.setMode}
                  value="hsl"
                  name="toggle"
                  type="radio"
                />
                <div {...themer('toggle')}>HSL</div>
              </label>
              <label {...themer('toggleContainer')}>
                <input
                  data-testid="mode-rgb"
                  checked={this.state.mode === 'rgb'}
                  onChange={this.setMode}
                  value="rgb"
                  name="toggle"
                  type="radio"
                />
                <div {...themer('toggle')}>RGB</div>
              </label>
            </div>
            {modeInputs}
            {alpha && (
              <div {...themer('alphaContainer')}>
                <SLAlphaInput
                  {...(readOnly ? { readOnly: true } : {})}
                  id={String.fromCharCode(945)}
                  value={a}
                  theme={themeNumberInput}
                  onChange={this.changeAlpha}
                />
              </div>
            )}
          </div>
        </div>
        <div {...themer('bottomWrapper')}>
          <div {...themer('swatchCompareContainer')}>
            {reset && (
              <div {...themer('tileBackground', 'currentSwatchContainer')}>
                <button
                  {...themer('swatch', 'currentSwatch')}
                  {...(readOnly
                    ? { disabled: true, 'aria-disabled': true }
                    : {})}
                  title="Reset color"
                  aria-label="Reset color"
                  data-testid="color-reset"
                  type="button"
                  style={{
                    backgroundColor: `rgba(${i.r}, ${i.g}, ${i.b}, ${i.a})`
                  }}
                  onClick={this.reset}
                >
                  {`${readOnly ? '' : 'Reset'}`}
                </button>
              </div>
            )}
            <div {...themer('tileBackground', 'newSwatchContainer')}>
              <div
                {...themer('swatch')}
                style={{ backgroundColor: rgbaBackground }}
              />
            </div>
          </div>
          <div {...themer('hexContainer')}>
            <label {...themer('numberInputLabel')}>#</label>
            <input
              {...(readOnly ? { readOnly: true } : {})}
              {...themer('numberInput')}
              data-testid="hex-input"
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
