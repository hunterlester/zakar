import React, { ReactElement, useEffect, useRef, useState, Ref } from 'react';
import SignaturePad from 'signature_pad';
import Pickr from '@simonwep/pickr';
import '@simonwep/pickr/dist/themes/classic.min.css';
import './DoodlePad.css';

interface State {
  colorTarget: string;
  backgroundColor: string;
  penColor: string;
  verseData: any;
}

const initPickr = () => {
  const pickr = Pickr.create({
    el: '.color-picker',
    theme: 'classic',
    default: '#000000',

    swatches: [
      'rgba(244, 67, 54, 1)',
      'rgba(233, 30, 99, 0.95)',
      'rgba(156, 39, 176, 0.9)',
      'rgba(103, 58, 183, 0.85)',
      'rgba(63, 81, 181, 0.8)',
      'rgba(33, 150, 243, 0.75)',
      'rgba(3, 169, 244, 0.7)',
      'rgba(0, 188, 212, 0.7)',
      'rgba(0, 150, 136, 0.75)',
      'rgba(76, 175, 80, 0.8)',
      'rgba(139, 195, 74, 0.85)',
      'rgba(205, 220, 57, 0.9)',
      'rgba(255, 235, 59, 0.95)',
      'rgba(255, 193, 7, 1)',
    ],

    components: {
      preview: true,
      opacity: true,
      hue: true,

      interaction: {
        // save: true
      },
    },
  });

  return pickr;
};

class DoodlePad extends React.PureComponent<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = {
      colorTarget: 'pen',
      backgroundColor: 'rgba(255, 255, 255, 1)',
      penColor: 'rgba(0, 0, 0, 1)',
      verseData: {},
    };
  }

  canvasEl = React.createRef<HTMLCanvasElement>();
  signaturePad: any = {};
  pickr: any = {};

  resizeCanvas = () => {
    const canvas = this.canvasEl.current!;
    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    canvas.width = canvas.offsetWidth * ratio;
    canvas.height = canvas.offsetHeight * ratio;
    canvas.getContext('2d')!.scale(ratio, ratio);
    if (this.signaturePad.clear) {
      this.signaturePad.clear();
    }
  };

  componentDidMount() {
    this.pickr = initPickr();
    const canvas = this.canvasEl.current!;
    this.signaturePad = new SignaturePad(canvas!);
    this.signaturePad.on();
    this.pickr.on('change', (color: any) => {
      if (this.state.colorTarget === 'pen') {
        this.signaturePad.penColor = color.toRGBA();
        this.setState({ ...this.state, penColor: color.toRGBA().toString() });
      } else {
        // TODO: this will wipe canvas on every change
        const ctx = canvas.getContext('2d')!;
        ctx.fillStyle = color.toRGBA();
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        this.setState({ ...this.state, backgroundColor: color.toRGBA().toString() });
      }
      this.pickr.applyColor();
    });

    window.addEventListener('resize', this.resizeCanvas);
    this.resizeCanvas();

    const verseData = JSON.parse(`${localStorage.getItem('verseData')}`);
    if (verseData) {
      this.setState({ ...this.state, verseData });
    }
  }

  componentDidUpdate(_props: Props, prevState: State) {
    if (this.state.colorTarget === 'pen') {
      this.pickr.setColor(this.state.penColor);
    } else {
      this.pickr.setColor(this.state.backgroundColor);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeCanvas);
    this.signaturePad.off();
  }

  render() {
    return (
      <>
        {this.state.verseData && <div dangerouslySetInnerHTML={{ __html: this.state.verseData.content }} />}
        <div className="ColorPickerContainer">
          <select
            value={this.state.colorTarget}
            onChange={(e) => {
              this.setState({ ...this.state, colorTarget: e.target.value });
            }}
          >
            <option value="pen">Pen Color</option>
            <option value="background">Background Color</option>
          </select>
          <div className="color-picker"></div>
        </div>
        <div className="pickrRoot"></div>
        <canvas ref={this.canvasEl}></canvas>
      </>
    );
  }
}

export default DoodlePad;
