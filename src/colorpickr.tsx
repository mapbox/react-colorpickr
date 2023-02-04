import React from 'react';
import PropTypes from 'prop-types';
import ControlSelect from '@mapbox/mr-ui/control-select';
import Tooltip from '@mapbox/mr-ui/tooltip';
import Icon from '@mapbox/mr-ui/icon';
import { XYControl } from './xy.tsx';
import { SliderInput } from './components/slider-input.tsx';
import { NumberInput } from './components/number-input.tsx';
import colorString from 'color-string';
import themeable from 'react-themeable';
import { defaultTheme } from './theme.ts';
import { autokey } from './autokey.ts';

import {
  rgbaColor,
  rgb2hsl,
  rgb2hex,
  hsl2rgb,
  colorCoords,
  colorCoordValue,
  getColor,
  isDark
} from './colorfunc.ts';

const isRGBChannel = (c) => ['r', 'g', 'b'].includes(c);
const isHSLChannel = (c) => ['h', 's', 'l'].includes(c);
const normalizeString = (v) => {
  // Normalize to string and drop a leading hash if provided.
  return v.trim().replace(/^#/, '');
};

class ColorPickr extends React.Component {
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
    mode: 'disc',
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
    const { color, mode } = this.state;
    this.props.onChange({ hexInput: !!hexInput, mode, ...color });
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

  changeColor = (e) => {
    const value = normalizeString(e.target.value);
    const hex = `#${value}`;
    const isValid = colorString.get(hex);
    const pastAlpha = this.state.color.a;
    const color = this.assignColor(hex) || this.state.color;
    color.a = pastAlpha;
    const nextColor = { ...color, ...{ hex: value } };
    this.setState({ color: nextColor }, () => {
      if (isValid) this.emitOnChange(true);
    });
  };

  onBlurHEX = (e) => {
    const hex = `#${normalizeString(e.target.value)}`;

    // If an invalid hex value remains `onBlur`, correct course by calling
    // `getColor` which will return a valid one to us.
    const pastAlpha = this.state.color.a;
    const nextColor = this.assignColor(hex) || this.state.color;
    nextColor.a = pastAlpha;
    this.setState({ color: nextColor }, this.emitOnChange.bind(this, true));
  };

  reset = () => {
    const { initialValue } = this.state;
    this.setState({ color: initialValue }, this.emitOnChange);
  };

  onXYChange = (pos: { x: number; y: number }) => {
    const color = colorCoordValue('h', pos);
    this.changeHSL(color);
  };

  onColorSliderChange = (value) => {
    const { channel } = this.state;
    const color = {};
    color[channel] = value;
    if (isRGBChannel(channel)) this.changeRGB(color);
    if (isHSLChannel(channel)) this.changeHSL(color);
  };

  onAlphaSliderChange = (value: number) => {
    this.changeHSL({
      a: value / 100
    });
  };

  setMode = (mode: string) => {
    this.setState({ mode }, this.emitOnChange);
  };

  setColorSpace = (e) => {
    console.log('e', e);
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

    const themeNumberInput = {
      numberInputContainer: themeObject.numberInputContainer,
      numberInput: themeObject.numberInput
    };

    const rgbaBackground = rgbaColor(r, g, b, a);
    const hueBackground = `hsl(${h}, 100%, 50%)`;
    const saturationBackground = `hsl(${h}, ${s}%, 100%)`;
    const lightnessBackground = `hsl(${h}, 100%, ${l}%)`;
    const redBackground = `rgb(${r}, 255, 255)`;
    const greenBackground = `rgb(255, ${g}, 255)`;
    const blueBackground = `rgb(255, 255, ${b})`;

    // Slider background color for saturation & value.
    const trackBackground = {
      h: `linear-gradient(
          to left,
          #ff0000 0%,
          #ff0099 10%,
          #cd00ff 20%,
          #3200ff 30%,
          #0066ff 40%,
          #00fffd 50%,
          #00ff66 60%,
          #35ff00 70%,
          #cdff00 80%,
          #ff9900 90%,
          #ff0000 100%
        )`,
      s: `linear-gradient(to left, ${hueBackground} 0%, #bbb 100%)`,
      l: `linear-gradient(to left, #fff 0%, ${hueBackground} 50%, #000 100%)`,
      r: `linear-gradient(to left, ${redBackground} 0%, #bbb 100%)`,
      g: `linear-gradient(to left, ${greenBackground} 0%, #bbb 100%)`,
      b: `linear-gradient(to left, ${blueBackground} 0%, #bbb 100%)`,
      a: `linear-gradient(to right, ${rgbaColor(r, g, b, 0)}, ${rgbaColor(
        r,
        g,
        b,
        100
      )})`
    };

    const discUI = (
      <>
        <div {...themer('gradientContainer')}>
          <XYControl
            {...colorCoords('h', color)}
            isDark={isDark([r, g, b])}
            backgroundColor={`#${hex}`}
            theme={{
              xyControlContainer: themeObject.xyControlContainer,
              xyControl: themeObject.xyControl,
              xyControlDark: themeObject.xyControlDark
            }}
            onChange={this.onXYChange}
          >
            <div
              {...themer('gradient')}
              style={{ background: hueBackground }}
            />
            <div {...themer('gradient', 'gradientHue')} />
          </XYControl>
        </div>
        <div {...themer('sliderContainer')}>
          <SliderInput
            id="hue"
            trackStyle={{ background: trackBackground.h }}
            min={0}
            max={360}
            value={h}
            colorValue={hueBackground}
            disabled={readOnly}
            onChange={this.onColorSliderChange}
          />
          {alpha && (
            <SliderInput
              id="alpha"
              trackStyle={{ background: trackBackground.a }}
              min={0}
              max={100}
              value={a}
              colorValue={`hsla(${h}, ${s}%, ${l}%, ${a})`}
              disabled={readOnly}
              onChange={this.onAlphaSliderChange}
            />
          )}
        </div>
      </>
    );

    const configuration = {
      h: {
        value: h,
        max: 360,
        displayValue: hueBackground,
        trackBackground: trackBackground.h,
        onChange: (v) => this.changeHSL('h', v)
      },
      s: {
        value: s,
        max: 100,
        displayValue: saturationBackground,
        trackBackground: trackBackground.s,
        onChange: (v) => this.changeHSL('s', v)
      },
      l: {
        value: l,
        max: 100,
        displayValue: lightnessBackground,
        trackBackground: trackBackground.l,
        onChange: (v) => this.changeHSL('l', v)
      },
      r: {
        value: r,
        max: 255,
        displayValue: redBackground,
        trackBackground: trackBackground.r,
        onChange: (v) => this.changeRGB('r', v)
      },
      g: {
        value: g,
        max: 255,
        displayValue: greenBackground,
        trackBackground: trackBackground.g,
        onChange: (v) => this.changeRGB('g', v)
      },
      b: {
        value: b,
        max: 255,
        displayValue: blueBackground,
        trackBackground: trackBackground.b,
        onChange: (v) => this.changeRGB('b', v)
      },
      a: {
        value: a,
        max: 100,
        displayValue: `hsla(${h}, ${s}%, ${l}%, ${a})`,
        trackBackground: trackBackground.a,
        onChange: this.onAlphaSliderChange
      }
    };

    const renderValues = (channel: string, index: number) => {
      const { value, max, displayValue, trackBackground, onChange } =
        configuration[channel];
      return (
        <div {...themer('valuesMode')} key={index}>
          <span {...themer('valuesModeLabel')}>{channel}</span>
          <div {...themer('valuesModeSlider')}>
            <SliderInput
              id={channel}
              trackStyle={{ background: trackBackground }}
              min={0}
              max={max}
              value={value}
              colorValue={displayValue}
              disabled={readOnly}
              onChange={onChange}
            />
          </div>
          <div {...themer('valuesModeInput')}>
            <NumberInput
              id={channel}
              min={0}
              max={max}
              value={value}
              theme={displayValue}
              onChange={onChange}
              readOnly={readOnly}
            />
          </div>
        </div>
      );
    };

    const valuesUI = (
      <div {...themer('valuesModeContainer')}>
        <div {...themer('valuesModeGroup')}>
          {['h', 's', 'l'].map(renderValues)}
        </div>
        <div {...themer('valuesModeGroup')}>
          {['r', 'g', 'b'].map(renderValues)}
        </div>
        {alpha && (
          <div {...themer('valuesModeGroup')}>{['a'].map(renderValues)}</div>
        )}
      </div>
    );

    let resetButton = (
      <button
        {...themer('swatch', 'currentSwatch')}
        {...(readOnly ? { disabled: true, 'aria-disabled': true } : {})}
        title="Reset color"
        aria-label="Reset color"
        data-testid="color-reset"
        type="button"
        style={{
          backgroundColor: `rgba(${i.r}, ${i.g}, ${i.b}, ${i.a})`
        }}
        onClick={this.reset}
      >
        {!readOnly && <Icon name="undo" inline={true} />}
      </button>
    );

    if (!readOnly) {
      resetButton = (
        <Tooltip coloring="dark" content="Reset">
          {resetButton}
        </Tooltip>
      );
    }

    return (
      <div {...themer('container')}>
        <div {...themer('controlsContainer')}>
          <Tooltip coloring="dark" content="Disc">
            <button
              {...themer('modeToggle', mode === 'disc' && 'modeToggleActive')}
              data-testid="mode-disc"
              onClick={() => this.setMode('disc')}
              type="button"
            >
              <Icon name="circle" />
            </button>
          </Tooltip>
          <Tooltip coloring="dark" content="Values">
            <button
              {...themer('modeToggle', mode === 'values' && 'modeToggleActive')}
              data-testid="mode-values"
              onClick={() => this.setMode('values')}
              type="button"
            >
              <Icon name="boolean" />
            </button>
          </Tooltip>
        </div>
        {mode === 'disc' && discUI}
        {mode === 'values' && valuesUI}
        <div {...themer('modeInputContainer')}>
          <div {...themer('colorSpaceContainer')}>
            <ControlSelect
              id="colorspace"
              value={'hex'}
              themeControlSelect={themeObject.colorSpaceSelect}
              onChange={this.setColorSpace}
              options={[
                {
                  label: 'HSL',
                  value: 'hsl'
                },
                {
                  label: 'RGB',
                  value: 'rgb'
                },
                {
                  label: 'HEX',
                  value: 'hex'
                }
              ]}
            />
          </div>
          <div {...themer('colorInputContainer')}>
            <input
              {...(readOnly ? { readOnly: true } : {})}
              {...themer('numberInput')}
              data-testid="hex-input"
              value={hex}
              onChange={this.changeColor}
              onBlur={this.onBlurHEX}
              type="text"
            />
          </div>
        </div>
        <div {...themer('swatchCompareContainer')}>
          {reset && (
            <div {...themer('tileBackground', 'currentSwatchContainer')}>
              {resetButton}
            </div>
          )}
          <div {...themer('tileBackground', 'newSwatchContainer')}>
            <div
              {...themer('swatch')}
              style={{ backgroundColor: rgbaBackground }}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default ColorPickr;
