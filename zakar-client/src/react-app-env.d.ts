/// <reference types="react-scripts" />

export interface LocationState {
  book?: string;
  chapter?: string;
}

declare global {
  interface Window {
    _BAPI: any;
    MediaRecorder: any;
  }
}

export interface ActivityProps {
  verses: any[];
}
