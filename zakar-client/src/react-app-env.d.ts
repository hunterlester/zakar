/// <reference types="react-scripts" />

export interface LocationState {
  book?: string;
  chapter?: string;
}

declare global {
  interface Window {
    _BAPI: any;
  }
}