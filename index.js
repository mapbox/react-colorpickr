'use strict';

require('babelify/polyfill'); // For Object.assign

var React = require('react');
var colorParser = require('color-parser');
var store = require('store');

var colorFunc = require('./src/colorfunc');
var XYControl = require('./src/xy');

var rgbaColor = colorFunc.getRGBA,
  rgb2hsv = colorFunc.rgb2hsv,
  hsv2hex = colorFunc.hsv2hex,
  hsv2rgb = colorFunc.hsv2rgb,
  rgb2hex = colorFunc.rgb2hex,
  hex2rgb = colorFunc.hex2rgb;

module.exports = React.createClass({
  propTypes: {
    onChange: React.PropTypes.func.isRequired,
    value: React.PropTypes.string,
    reset: React.PropTypes.bool
  },

  getInitialState: function() {
    var color = (this.props.value) ? this.props.value : '#3887be';
    this.original = color;

    return {
      color: this.getColor(color),
      mode: (store.get('mode')) ? store.get('mode') : 'rgb'
    };
  },

  componentWillReceiveProps: function(props) {
    this.setState({
      color: this.getColor(props.value)
    });
  },

  changeHSV: function(p, val) {
    var j = p; if (typeof j === 'string') { j = {}; j[p] = val.target.value; }
    var color = this.state.color;
    var rgb = hsv2rgb(j.h||color.h, j.s||color.s, j.v||color.v);
    var hex = rgb2hex(rgb.r, rgb.g, rgb.b);
    this.props.onChange(Object.assign(color, j, rgb, {hex: hex}));
  },

  changeRGB: function(p, val) {
    var j = p; if (typeof j === 'string') { j = {}; j[p] = val.target.value; }
    var color = this.state.color;
    var hsv = rgb2hsv(j.r||color.r, j.g||color.g, j.b||color.b);
    this.props.onChange(Object.assign(color, j, hsv, {
      hex: rgb2hex(j.r||color.r, j.g||color.g, j.b||color.b)
    }));
  },

  changeAlpha: function(e) {
    var a = e.target.value;
    this.props.onChange(Object.assign(this.state.color, {a: a}));
  },

  reset: function(e) {
    this.props.onChange(this.getColor(this.original));
  },

  getColor: function(cssColor) {
    if (cssColor.length === 3 ||
        cssColor.length === 6) cssColor = '#' + cssColor;

    var rgba = colorParser(cssColor);
    var r = rgba.r,
      g = rgba.g,
      b = rgba.b,
      a = rgba.a * 100;

    var hsv = rgb2hsv(r, g, b);

    return Object.assign(hsv, {
      r: r,
      g: g,
      b: b,
      a: a,
      hex: rgb2hex(r, g, b)
    });
  },

  _onSVChange: function(pos) {
    this.changeHSV({
      s: pos.x,
      v: 100 - pos.y
    });
  },

  _onHueChange: function(e) {
    this.changeHSV({
      h: e.target.value
    });
  },

  _onAlphaChange: function(e) {
    this.changeHSV({
      a: e.target.value
    });
  },

  _onClick: function(e) {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
  },

  setMode: function(e) {
    store.set('mode', e.target.value);
    this.setState({mode: e.target.value});
  },

  render: function () {
    var color = this.state.color;
    var r = color.r,
        g = color.g,
        b = color.b;

    var h = color.h,
        s = color.s,
        v = color.v;

    var a = color.a,
        hex = color.hex;

    var rgbaBackground = rgbaColor(r, g, b, a);
    var opacityGradient = 'linear-gradient(to right, ' +
      rgbaColor(r, g, b, 0) + ', ' +
      rgbaColor(r, g, b, 100) + ')';

    var hueBackground = '#' + hsv2hex(h, 100, 100);

    return (
      /* jshint ignore:start */
      <div className='colorpickr' onClick={this._onClick}>
        <div className='col'>
          <div className='selector' style={{backgroundColor: hueBackground}}>
            <div className='gradient white'></div>
            <div className='gradient dark'></div>
            <XYControl
              className='slider-xy'
              x={s}
              y={100 - v}
              xmax={100}
              ymax={100}
              onChange={this._onSVChange} />
          </div>
        </div>

        <div className='col'>

            <div className='mode-tabs'>
              <button
                onClick={this.setMode}
                className={this.state.mode === 'rgb' && 'active'}
                value='rgb'>RGB
              </button>
              <button
                className={this.state.mode === 'hsv' && 'active'}
                onClick={this.setMode}
                value='hsv'>HSV
              </button>
            </div>

            <div className='inputs'>
              {(this.state.mode === 'rgb') ? (
              <div>
                <fieldset>
                  <label>R</label>
                  <input
                    value={r}
                    onChange={this.changeRGB.bind(null, 'r')}
                    type='number'
                    min={0}
                    max={255}
                    step={1} />
                </fieldset>
                <fieldset>
                  <label>G</label>
                  <input
                    value={g}
                    onChange={this.changeRGB.bind(null, 'g')}
                    type='number'
                    min={0}
                    max={255}
                    step={1} />
                </fieldset>
                <fieldset>
                  <label>B</label>
                  <input
                    value={b}
                    onChange={this.changeRGB.bind(null, 'b')}
                    type='number'
                    min={0}
                    max={255}
                    step={1} />
                </fieldset>
              </div>
              ) : (
              <div>
                <fieldset>
                  <label>H</label>
                  <input
                    value={h}
                    onChange={this.changeHSV.bind(null, 'h')}
                    type='number'
                    min={0}
                    max={360}
                    step={1} />
                </fieldset>
                <fieldset>
                  <label>S</label>
                  <input
                    value={s}
                    onChange={this.changeHSV.bind(null, 's')}
                    type='number'
                    min={0}
                    max={100}
                    step={1} />
                </fieldset>
                <fieldset>
                  <label>V</label>
                  <input
                    value={v}
                    onChange={this.changeHSV.bind(null, 'v')}
                    type='number'
                    min={0}
                    max={100}
                    step={1} />
                </fieldset>
              </div>
              )}

              <fieldset>
                <label className='label'>A</label>
                <input
                  value={a}
                  onChange={this.changeAlpha}
                  type='number'
                  min={0}
                  max={100}
                  step={1} />
              </fieldset>

            </div>
            <div className='sliders'>
              <input
                className='hue'
                value={h}
                onChange={this._onHueChange}
                type='range'
                min={0}
                max={360} />

              <div className='fill-tile'>
                <input
                  className='opacity'
                  value={a}
                  onChange={this._onAlphaChange}
                  style={{background: opacityGradient}}
                  type='range'
                  min={0}
                  max={100} />
              </div>

          </div>
        </div>

        <div className='colorpickr-floor'>
          <div className='output'>
            <div className='fill-tile color'>
              <div className='swatch' style={{backgroundColor: rgbaBackground}}></div>
            </div>
            <label>{rgbaBackground}</label>
          </div>
          <div className='actions'>
            {this.props.reset && <button onClick={this.reset}>reset</button>}
          </div>
        </div>

      </div>
      /* jshint ignore:end */
    );
  }
});
