import React, { SyntheticEvent } from 'react';
import ControlSelect from '@mapbox/mr-ui/control-select';
import Tooltip from '@mapbox/mr-ui/tooltip';
import Icon from '@mapbox/mr-ui/icon';
import { XYInput } from './components/xy-input';
import { SliderInput } from './components/slider-input';
import { NumberInput } from './components/number-input';
import { EyedropperInput } from './components/eyedropper-input';
import colorString from 'color-string';
import themeable from 'react-themeable';
import { defaultTheme } from './theme';
import { autokey } from './autokey';
import { rgb2hsl, rgb2hex, hsl2rgb, getColor, isDark } from './colorfunc';

const normalizeString = (v: string) => {
  // Normalize to string and drop a leading hash if provided.
  return v.trim().replace(/^#/, '');
};

type ColorSpace = 'hsl' | 'rgb' | 'hex';
type Mode = 'disc' | 'values';

interface FocusEvent<T = Element> extends SyntheticEvent<T, FocusEvent> {
  relatedTarget: EventTarget | null;
  target: EventTarget & T;
}

interface ConfigObject {
  name: string;
  value: number;
  max: number;
  displayValue: string;
  trackBackground: string;
  onChange: (v: number) => void;
}

interface Color {
  h: number;
  s: number;
  l: number;
  r: number;
  g: number;
  b: number;
  a: number;
  hex: string;
  hexInput?: boolean;
  mode?: 'disc' | 'values';
}

interface Props {
  onChange: (color: Color) => void;
  theme?: { [key: string]: string };
  mode?: Mode;
  colorSpace?: ColorSpace;
  initialValue?: string;
  discRadius?: number;
  eyedropper?: boolean;
  reset?: boolean;
  alpha?: boolean;
  readOnly?: boolean;
  mounted?: (constructor: ColorPickr) => void;
}

interface State {
  mode: Mode;
  colorSpace: ColorSpace;
  initialValue: Color;
  color: Color;
}

class ColorPickr extends React.Component<Props, State> {
  static defaultProps = {
    initialValue: '#000',
    discRadius: 18,
    alpha: true,
    eyedropper: true,
    reset: true,
    mode: 'disc',
    colorSpace: 'hex',
    theme: {},
    readOnly: false
  };

  assignColor(v: string) {
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

  constructor(props: Props) {
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

  overrideValue = (cssColor: 'string', shouldUpdateInitialValue: boolean) => {
    const color = this.assignColor(cssColor);
    if (shouldUpdateInitialValue) {
      this.setState({ color, initialValue: color }, this.emitOnChange);
    } else {
      this.setState({ color }, this.emitOnChange);
    }
  };

  emitOnChange = (hexInput = false) => {
    const { color, mode } = this.state;
    this.props.onChange({ hexInput: !!hexInput, mode, ...color });
  };

  setNextColor = (obj: Color) => {
    const { color } = this.state;
    this.setState(
      {
        color: { ...color, ...obj }
      },
      this.emitOnChange
    );
  };

  changeHSL = (channels: {
    h?: number;
    s?: number;
    l?: number;
    a?: number;
  }) => {
    const { color } = this.state;
    const nextColor = { ...color, ...channels };
    const { h, s, l } = nextColor;
    const rgb = hsl2rgb(h, s, l);
    const hex = rgb2hex(rgb.r, rgb.g, rgb.b);
    this.setNextColor({ ...nextColor, ...rgb, ...{ hex } });
  };

  onXYChange = ({ x, y }: { x: number; y: number }) => {
    this.changeHSL({
      s: Math.round(x),
      l: 100 - Math.round(y)
    });
  };

  changeRGB = (channels: { r?: number; g?: number; b?: number }) => {
    const { color } = this.state;
    const nextColor = { ...color, ...channels };
    const { r, g, b } = nextColor;
    const hsl = rgb2hsl(r, g, b);
    const hex = rgb2hex(r, g, b);
    this.setNextColor({ ...nextColor, ...hsl, ...{ hex } });
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

  changeColor = (value: string) => {
    value = normalizeString(value);
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

  onBlur = (e: FocusEvent<HTMLInputElement>) => {
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

  setMode = (mode: Mode) => {
    this.setState({ mode }, this.emitOnChange);
  };

  setColorSpace = (colorSpace: ColorSpace) => {
    this.setState({ colorSpace });
  };

  getColorCoords = () => {
    const { color } = this.state;
    return {
      xmax: 100,
      ymax: 100,
      x: color.s,
      y: 100 - color.l
    };
  };

  render() {
    const { color, mode, colorSpace, initialValue: i } = this.state;
    const { r, g, b, h, s, l, hex } = color;
    const { theme, readOnly, reset, alpha, discRadius, eyedropper } =
      this.props;
    const a = Math.round(color.a * 100);
    const themeObject = { ...defaultTheme, ...theme };

    if (!readOnly) {
      themeObject.numberInput = `${themeObject.numberInput} bg-white`;
    } else {
      themeObject.xyControlContainer = `${themeObject.xyControlContainer} events-none`;
    }

    const themer = autokey(themeable(themeObject));

    const rgbBackground = `rgb(${r},${g},${b})`;
    const rgbaBackground = `rgba(${r},${g},${b},${color.a})`;
    const hueBackground = `hsl(${h}, 100%, 50%)`;
    const saturationBackground = `hsl(${h},${s}%,50%)`;
    const lightnessBackground = `hsl(${h},100%,${l}%)`;
    const redLowBackground = `rgb(0, ${g},${b})`;
    const redHighBackground = `rgb(255,${g},${b})`;
    const greenLowBackground = `rgb(${r},0,${b})`;
    const greenHighBackground = `rgb(${r},255,${b})`;
    const blueLowBackground = `rgb(${r},${g},0)`;
    const blueHighBackground = `rgb(${r},${g},255)`;

    const configuration: { [channel: string]: ConfigObject } = {
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
        onChange: (v: number) => this.changeHSL({ h: v })
      },
      s: {
        name: 'Saturation',
        value: s,
        max: 100,
        displayValue: saturationBackground,
        trackBackground: `linear-gradient(to left, ${hueBackground} 0%, #bbb 100%)`,
        onChange: (v: number) => this.changeHSL({ s: v })
      },
      l: {
        name: 'Lightness',
        value: l,
        max: 100,
        displayValue: lightnessBackground,
        trackBackground: `linear-gradient(to left, #fff 0%, ${hueBackground} 50%, #000 100%)`,
        onChange: (v: number) => this.changeHSL({ l: v })
      },
      r: {
        name: 'Red',
        value: r,
        max: 255,
        displayValue: rgbBackground,
        trackBackground: `linear-gradient(to left, ${redHighBackground} 0%, ${redLowBackground} 100%)`,
        onChange: (v: number) => this.changeRGB({ r: v })
      },
      g: {
        name: 'Green',
        value: g,
        max: 255,
        displayValue: rgbBackground,
        trackBackground: `linear-gradient(to left, ${greenHighBackground} 0%, ${greenLowBackground} 100%)`,
        onChange: (v: number) => this.changeRGB({ g: v })
      },
      b: {
        name: 'Blue',
        value: b,
        max: 255,
        displayValue: rgbBackground,
        trackBackground: `linear-gradient(to left, ${blueHighBackground} 0%, ${blueLowBackground} 100%)`,
        onChange: (v: number) => this.changeRGB({ b: v })
      },
      a: {
        name: 'Alpha',
        value: a,
        max: 100,
        displayValue: `hsla(${h},${s}%,${l}%,${color.a})`,
        trackBackground: `linear-gradient(to left, ${rgbBackground} 0%, rgba(${r},${g},${b},0) 100%)`,
        onChange: (v: number) => this.changeHSL({ a: v / 100 })
      }
    };

    const discUI = (
      <>
        <div {...themer('gradientContainer')}>
          <XYInput
            {...this.getColorCoords()}
            isDark={isDark([r, g, b])}
            backgroundColor={`#${hex}`}
            discRadius={discRadius}
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
          </XYInput>
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
        configuration[channel] as ConfigObject;
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
              theme={{
                numberInput: themeObject.numberInput
              }}
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
          <div {...themer('modesContainer')}>
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
                {...themer(
                  'modeToggle',
                  mode === 'values' && 'modeToggleActive'
                )}
                data-testid="mode-values"
                onClick={() => this.setMode('values')}
                type="button"
              >
                <Icon name="boolean" />
              </button>
            </Tooltip>
          </div>
          {eyedropper && 'EyeDropper' in window && (
            <EyedropperInput
              disabled={readOnly}
              onChange={this.changeColor}
              theme={{
                eyeDropper: themeObject.eyeDropper,
                eyeDropperIcon: themeObject.eyeDropperIcon
              }}
            />
          )}
        </div>
        {mode === 'disc' && discUI}
        {mode === 'values' && valuesUI}
        <div {...themer('modeInputContainer')}>
          <div {...themer('colorSpaceContainer')}>
            <ControlSelect
              id="colorspace"
              value={colorSpace}
              themeControlWrapper="w-full"
              themeControlSelectContainer={
                themeObject.colorSpaceSelectContainer
              }
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
              onChange={(e) => this.changeColor(e.target.value)}
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
