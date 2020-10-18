/// <reference types="react-scripts" />

declare global {
  interface Window {
    MediaRecorder: MediaRecorder;
    webkitSpeechRecognition: any;
    webkitSpeechGrammarList: any;
    webkitSpeechRecognitionEvent: any;
  }
}

export interface ActivitiesStates {
  Build: boolean;
  Read: boolean;
  Study: boolean;
  Recite: boolean;
  Type: boolean;
  Listen: boolean;
  Complete: boolean;
}
