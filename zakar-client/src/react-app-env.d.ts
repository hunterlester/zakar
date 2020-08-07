/// <reference types="react-scripts" />

declare global {
  interface Window {
    _BAPI: any;
    MediaRecorder: any;
  }
}

export interface ActivityProps {
  verseString: string;
}
