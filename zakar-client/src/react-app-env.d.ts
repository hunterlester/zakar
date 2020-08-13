/// <reference types="react-scripts" />

declare global {
  interface Window {
    MediaRecorder: MediaRecorder;
    webkitSpeechRecognition: any;
    webkitSpeechGrammarList: any;
    webkitSpeechRecognitionEvent: any;
  }
}

export interface ActivityProps {
  verseString?: string;
  setActivitiesStates?: Dispatch<SetStateAction<ActivitiesStates>>;
}

export interface ActivitiesStates {
  Build: boolean;
  Read: boolean;
  Recite: boolean;
  Type: boolean;
  Listen: boolean;
}
