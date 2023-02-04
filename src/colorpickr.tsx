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
  rgb2hsl,
  rgb2hex,
  hsl2rgb,
  colorCoords,
  colorCoordValue,
  getColor,
  isDark
} from './colorfunc.ts';

const normalizeString = (v) => {
  // Normalize to string and drop a leading hash if provided.
  return v.trim().replace(/^#/, '');
};

class ColorPickr extends React.Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    mounted: PropTypes.func,
    theme: PropTypes.object,
    mode: PropTypes.string,
    colorSpace: PropTypes.string,
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
    colorSpace: 'hex',
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
    const { mode, colorSpace, initialValue } = props;
    const color = this.assignColor(initialValue);

    this.state = {
      mode,
      initialValue: color,
      colorSpace,
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

  getColorSpaceOutput = () => {
    const { colorSpace, color } = this.state;
    const { h, s, l, a, r, g, b, hex } = color;
    switch (colorSpace) {
      case 'hex':
        return `#${hex}`;
      case 'hsl':
        return a < 1 ? `hsla(${h},${s}%,${l}%,${a})` : `hsl(${h},${s}%,${l}%)`;
      case 'rgb':
        return a < 1 ? `rgba(${r},${g},${b},${a})` : `rgb(${r},${g},${b})`;
    }
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

  onBlur = (e) => {
    const { color, colorSpace } = this.state;
    const hex =
      colorSpace === 'hex' ? `#${normalizeString(e.target.value)}` : color.hex;

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

  setMode = (mode: string) => {
    this.setState({ mode }, this.emitOnChange);
  };

  setColorSpace = (colorSpace: string) => {
    this.setState({ colorSpace });
  };

  render() {
    const { color, mode, colorSpace, initialValue: i } = this.state;
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

    const rgbBackground = `rgb(${r},${g},${b})`;
    const rgbaBackground = `rgba(${r},${g},${b},${color.a})`;
    const hueBackground = `hsl(${h}, 100%, 50%)`;
    const saturationBackground = `hsl(${h},${s}%,${l}%)`;
    const lightnessBackground = `hsl(${h},100%,${l}%)`;
    const redLowBackground = `rgb(0, ${g},${b})`;
    const redHighBackground = `rgb(255,${g},${b})`;
    const greenLowBackground = `rgb(${r},0,${b})`;
    const greenHighBackground = `rgb(${r},255,${b})`;
    const blueLowBackground = `rgb(${r},${g},0)`;
    const blueHighBackground = `rgb(${r},${g},255)`;

    const configuration = {
      h: {
        name: 'Hue',
        value: h,
        max: 360,
        displayValue: hueBackground,
        trackBackground: `linear-gradient(
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
        `,
        onChange: (v) => this.changeHSL('h', v)
      },
      s: {
        name: 'Saturation',
        value: s,
        max: 100,
        displayValue: saturationBackground,
        trackBackground: `linear-gradient(to left, ${hueBackground} 0%, #bbb 100%)`,
        onChange: (v) => this.changeHSL('s', v)
      },
      l: {
        name: 'Lightness',
        value: l,
        max: 100,
        displayValue: lightnessBackground,
        trackBackground: `linear-gradient(to left, #fff 0%, ${hueBackground} 50%, #000 100%)`,
        onChange: (v) => this.changeHSL('l', v)
      },
      r: {
        name: 'Red',
        value: r,
        max: 255,
        displayValue: rgbBackground,
        trackBackground: `linear-gradient(to left, ${redHighBackground} 0%, ${redLowBackground} 100%)`,
        onChange: (v) => this.changeRGB('r', v)
      },
      g: {
        name: 'Green',
        value: g,
        max: 255,
        displayValue: rgbBackground,
        trackBackground: `linear-gradient(to left, ${greenHighBackground} 0%, ${greenLowBackground} 100%)`,
        onChange: (v) => this.changeRGB('g', v)
      },
      b: {
        name: 'Blue',
        value: b,
        max: 255,
        displayValue: rgbBackground,
        trackBackground: `linear-gradient(to left, ${blueHighBackground} 0%, ${blueLowBackground} 100%)`,
        onChange: (v) => this.changeRGB('b', v)
      },
      a: {
        name: 'Alpha',
        value: a,
        max: 100,
        displayValue: `hsla(${h}, ${s}%, ${l}%, ${color.a})`,
        trackBackground: `linear-gradient(to left, ${rgbBackground} 0%, rgba(${r},${g},${b},0) 100%)`,
        onChange: (v) => this.changeHSL('a', v / 100)
      }
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
            trackStyle={{ background: configuration.h.trackBackground }}
            min={0}
            max={configuration.h.max}
            value={h}
            colorValue={configuration.h.displayValue}
            disabled={readOnly}
            onChange={configuration.h.onChange}
          />
          {alpha && (
            <SliderInput
              id="alpha"
              trackStyle={{ background: configuration.a.trackBackground }}
              min={0}
              max={configuration.a.max}
              value={a}
              colorValue={configuration.a.displayValue}
              disabled={readOnly}
              onChange={configuration.a.onChange}
            />
          )}
        </div>
      </>
    );

    const renderValues = (channel: string, index: number) => {
      const { name, value, max, displayValue, trackBackground, onChange } =
        configuration[channel];
      return (
        <div {...themer('valuesMode')} key={index}>
          <span title={name} {...themer('valuesModeLabel')}>
            {channel}
          </span>
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
              theme={themeNumberInput}
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
              value={colorSpace}
              themeControlSelect={themeObject.colorSpaceSelect}
              onChange={this.setColorSpace}
              options={[
                {
                  label: color.a < 1 ? 'HSLA' : 'HSL',
                  value: 'hsl'
                },
                {
                  label: color.a < 1 ? 'RGBA' : 'RGB',
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
              data-testid="color-input"
              value={this.getColorSpaceOutput()}
              onChange={this.changeColor}
              onBlur={this.onBlur}
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
