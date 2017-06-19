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

class ColorPickr extends React.Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    colorAttribute: PropTypes.string,
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
    colorAttribute: 'h'
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
  }

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
  }

  changeAlpha = (e) => {
    const value = e.target.value || '0';
    if (value && typeof value === 'string') {
      const a = Math.floor(parseFloat(value));
      const color = Object.assign({}, this.state.color, { a: a / 100 });
      this.setState({ color: color }, () => {
        this.emitOnChange(color);
      });
    }
  }

  changeHEX = (e) => {
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
  }

  reset = () => {
    this.setState({ color: getColor(this.state.originalValue) }, this.emitOnChange);
  }

  _onXYChange = (mode, pos) => {
    const color = colorCoordValue(mode, pos);
    if (isRGBMode(mode)) this.changeRGB(color);
    if (isHSVMode(mode)) this.changeHSV(color);
  }

  _onColorSliderChange(mode, e) {
    const color = {};
    color[mode] = parseFloat(e.target.value);
    if (isRGBMode(mode)) this.changeRGB(color);
    if (isHSVMode(mode)) this.changeHSV(color);
  }

  _onAlphaSliderChange = (e) => {
    this.changeHSV({
      a: Math.floor(parseFloat(e.target.value)) / 100
    });
  }

  setMode = (e) => {
    const obj = { mode: e.target.value };
    this.setState(obj, () => {
      this.emitOnChange(obj);
    });
  }

  setColorAttribute(attribute) {
    const obj = { colorAttribute: attribute };
    this.setState(obj, () => {
      this.emitOnChange(obj);
    });
  }

  render() {
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
      <div className="colorpickr round inline-block bg-gray-faint p12 txt-s">
        <div className="flex-parent">
          <div className="flex-child z1 w180 h180 relative">
            <RGBGradient
              active={colorAttribute === 'r'}
              color="r"
              opacityLow={opacityLow}
              opacityHigh={opacityHigh}
            />
            <RGBGradient
              active={colorAttribute === 'g'}
              color="g"
              opacityLow={opacityLow}
              opacityHigh={opacityHigh}
            />
            <RGBGradient
              active={colorAttribute === 'b'}
              color="b"
              opacityLow={opacityLow}
              opacityHigh={opacityHigh}
            />

            <HGradient active={colorAttribute === 'h'} hueBackground={hueBackground} />
            <SVGradient
              active={colorAttribute === 's'}
              color="s"
              opacityLow={opacityLow}
              opacityHigh={opacityHigh}
            />
            <SVGradient
              active={colorAttribute === 'v'}
              color="v"
              opacityLow={opacityLow}
              opacityHigh={opacityHigh}
            />

            <XYControl
              className="cp-slider-xy"
              {...coords}
              handleClass={isDark([r, g, b, a]) ? '' : 'dark'}
              onChange={(e) => {this._onXYChange(colorAttribute, e)}}
            />
            <div className={`cp-colormode-slider cp-colormode-attribute-slider ${colorAttribute}`}>
              <input
                type="range"
                value={colorAttributeValue}
                style={hueSlide}
                onChange={(e) => {this._onColorSliderChange(colorAttribute, e)}}
                className="cp-colormode-slider-input"
                min={0}
                max={colorAttributeMax}
              />
            </div>
          </div>

          <div className="flex-child w120 pl24">
            <div className="grid mb12">
              <button
                onClick={this.setMode}
                className={`col col--6 btn btn--gray-light py3 round-l ${this.state.mode === 'rgb' ? 'is-active' : ''}`}
                value="rgb"
              >
                RGB
              </button>
              <button
                className={`col col--6 btn btn--gray-light py3 round-r ${this.state.mode === 'hsv' ? 'is-active' : ''}`}
                onClick={this.setMode}
                value="hsv"
              >
                HSV
              </button>
            </div>

            {this.state.mode === 'rgb'
              ? <div>
                  <div
                    className={`mb3 flex-parent ${colorAttribute === 'r' ? 'is-active' : ''}`}
                  >
                    <ModeInput
                      name={this.state.modeInputName}
                      checked={colorAttribute === 'r'}
                      onChange={() => {this.setColorAttribute('r')}}
                    />
                    <RGBInput value={r} onChange={(e) => {this.changeRGB('r', e)}} label="R" />
                  </div>
                  <div
                    className={`mb3 flex-parent ${colorAttribute === 'g' ? 'is-active' : ''}`}
                  >
                    <ModeInput
                      name={this.state.modeInputName}
                      checked={colorAttribute === 'g'}
                      onChange={() => {this.setColorAttribute('g')}}
                    />
                    <RGBInput value={g} onChange={(e) => { this.changeRGB('g', e)}} label="G" />
                  </div>
                  <div
                    className={`mb3 flex-parent ${colorAttribute === 'b' ? 'is-active' : ''}`}
                  >
                    <ModeInput
                      name={this.state.modeInputName}
                      checked={colorAttribute === 'b'}
                      onChange={() => {this.setColorAttribute('b')}}
                    />
                    <RGBInput value={b} onChange={(e) => {this.changeRGB('b', e)}} label="B" />
                  </div>
                </div>
              : <div>
                  <div
                    className={`mb3 flex-parent ${colorAttribute === 'h' ? 'is-active' : ''}`}
                  >
                    <ModeInput
                      name={this.state.modeInputName}
                      checked={colorAttribute === 'h'}
                      onChange={() => {this.setColorAttribute('h')}}
                    />
                    <HInput value={h} onChange={(e) => {this.changeHSV('h', e)}} label="H" />
                  </div>
                  <div
                    className={`mb3 flex-parent ${colorAttribute === 's' ? 'is-active' : ''}`}
                  >
                    <ModeInput
                      name={this.state.modeInputName}
                      checked={colorAttribute === 's'}
                      onChange={() => {this.setColorAttribute('s')}}
                    />
                    <SVAlphaInput value={s} onChange={(e) => {this.changeHSV('s', e)}} label="S" />
                  </div>
                  <div
                    className={`mb3 flex-parent ${colorAttribute === 'v' ? 'is-active' : ''}`}
                  >
                    <ModeInput
                      name={this.state.modeInputName}
                      checked={colorAttribute === 'v'}
                      onChange={() => {this.setColorAttribute('v')}}
                    />
                    <SVAlphaInput value={v} onChange={(e) => {this.changeHSV('v', e)}} label="V" />
                  </div>
                </div>}

              <div className="relative mb3 mt12">
                <SVAlphaInput
                  value={a}
                  onChange={this.changeAlpha}
                  label={String.fromCharCode(945)}
                />
              </div>
            <div className="cp-fill-tile">
              <input
                type="range"
                className="cp-alpha-slider-input"
                value={a}
                onChange={this._onAlphaSliderChange}
                style={{ background: opacityGradient }}
                min={0}
                max={100}
              />
            </div>
          </div>
        </div>

        <div className="flex-parent mt6">
          <div className="flex-child w180 flex-parent flex-parent--center-cross">
            <span className='mr3 color-gray'>New</span>
            <span className="cp-fill-tile inline-block h24 w36 round-l relative">
              <div className="h-full w-full round-l absolute" style={{ backgroundColor: rgbaBackground }} />
            </span>
            {this.state.reset && <div className='inline-block flex-parent flex-parent--center-cross'>
              <span className="cp-fill-tile inline-block h24 w36 round-r border-l border--gray-faint relative">
                <button
                  className="w-full h-full round-r absolute"
                  title="Reset color"
                  style={{ backgroundColor: this.state.originalValue }}
                  onClick={this.reset}
                />
              </span>
              <span className='ml3 color-gray'>Current</span>
            </div>}
          </div>
          <div className="flex-child w120 pl24 align-right">
            <div className="relative">
              <label className='absolute top left pl6 py3 color-gray-light txt-bold'>#</label>
              <input value={hex} className="w-full pl18 input input--s bg-white" onChange={this.changeHEX} type="text" />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ColorPickr;
