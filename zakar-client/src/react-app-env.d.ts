/// <reference types="react-scripts" />

declare global {
  interface Window {
    _BAPI: any;
    MediaRecorder: any;
    webkitSpeechRecognition: any;
    webkitSpeechGrammarList: any;
    webkitSpeechRecognitionEvent: any;
  }
}

export interface ActivityProps {
  verseString: string;
}
