import React, { ReactElement } from 'react';
import SignaturePad from 'signature_pad';
import Pickr from '@simonwep/pickr';
import '@simonwep/pickr/dist/themes/classic.min.css';
import './Doodle.css';
import { ActivityProps } from 'react-app-env';

interface State {
  colorTarget: string;
  backgroundColor: string;
  penColor: string;
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

class Doodle extends React.PureComponent<ActivityProps, State> {
  constructor(props: ActivityProps) {
    super(props);
    this.state = {
      colorTarget: 'pen',
      backgroundColor: 'rgba(255, 255, 255, 1)',
      penColor: 'rgba(0, 0, 0, 1)',
    };
  }

  canvasEl = React.createRef<HTMLCanvasElement>();
  signaturePad: SignaturePad | null = null;
  pickr: Pickr | null = null;

  resizeCanvas = (): void => {
    const canvas: HTMLCanvasElement | null = this.canvasEl.current;
    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    if (canvas) {
      canvas.width = canvas.offsetWidth * ratio;
      canvas.height = canvas.offsetHeight * ratio;
      const canvasContext = canvas.getContext('2d');
      if (canvasContext) {
        canvasContext.scale(ratio, ratio);
      }
    }
    if (this.signaturePad && this.signaturePad.clear) {
      const data = this.signaturePad.toData();
      this.signaturePad.clear();
      this.signaturePad.fromData(data);
    }
  };

  componentDidMount(): void {
    this.pickr = initPickr();
    const canvas: HTMLCanvasElement | null = this.canvasEl.current;
    if (canvas) {
      this.signaturePad = new SignaturePad(canvas);
      const doodleData = JSON.parse(`${localStorage.getItem('doodle')}`);
      if (doodleData) {
        // console.log('loading doodle data: ', doodleData);
        this.signaturePad.fromData(doodleData);
      }
      this.signaturePad.on();

      canvas.addEventListener('mouseup', () => {
        // console.log(this.signaturePad!.toData());
        if (this.signaturePad) {
          localStorage.setItem('doodle', JSON.stringify(this.signaturePad.toData()));
        }
      });

      canvas.addEventListener('touchend', () => {
        if (this.signaturePad) {
          localStorage.setItem('doodle', JSON.stringify(this.signaturePad.toData()));
        }
      });
    }
    this.pickr.on('change', (color: Pickr.HSVaColor) => {
      if (this.signaturePad && this.state.colorTarget === 'pen') {
        this.signaturePad.penColor = color.toRGBA().toString();
        this.setState({ ...this.state, penColor: color.toRGBA().toString() });
      } else {
        // TODO: this will wipe canvas on every change
        if (canvas) {
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.fillStyle = color.toRGBA().toString();
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }
          this.setState({ ...this.state, backgroundColor: color.toRGBA().toString() });
        }
      }
      if (this.pickr) {
        this.pickr.applyColor();
      }
    });

    window.addEventListener('resize', this.resizeCanvas);
    this.resizeCanvas();
  }

  componentDidUpdate(): void {
    if (this.state.colorTarget === 'pen') {
      if (this.pickr) this.pickr.setColor(this.state.penColor);
    } else {
      if (this.pickr) this.pickr.setColor(this.state.backgroundColor);
    }
  }

  componentWillUnmount(): void {
    window.removeEventListener('resize', this.resizeCanvas);
    if (this.signaturePad) {
      this.signaturePad.off();
    }
  }

  render(): ReactElement {
    return (
      <>
        <div className="ColorPickerContainer">
          {/* <select
              value={this.state.colorTarget}
              onChange={(e) => {
                this.setState({ ...this.state, colorTarget: e.target.value });
              }}
            >
              <option value="pen">Pen Color</option>
              <option value="background">Background Color</option>
            </select> */}
          <div className="color-picker"></div>
          <button
            className="ActivityItem"
            onClick={() => {
              if (this.signaturePad) {
                this.signaturePad.clear();
              }
              localStorage.removeItem('doodle');
            }}
          >
            Clear
          </button>
        </div>
        <div className="pickrRoot"></div>
        <canvas ref={this.canvasEl}></canvas>
      </>
    );
  }
}

export default Doodle;
