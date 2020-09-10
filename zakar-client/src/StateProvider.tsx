import React, {useState, createContext} from 'react';
import { ActivitiesStates } from 'react-app-env';
import { IPointGroup } from 'signature_pad';

interface Props {
    children: React.ReactNode;
}

interface State {
    activities: ActivitiesStates;
    verseIDArray: string[];
    verseString: string;
    doodle: IPointGroup[];
    verseCanonical: string;
    next_verse: string;
    prev_verse: string;
}

const initActivities: ActivitiesStates = JSON.parse(`${localStorage.getItem('activities')}`) || { Build: false, Read: false, Recite: false, Type: false, Listen: false };

const defaultState = {
    activities: initActivities,
    verseIDArray: [] as string[],
    verseString: '',
    doodle: [] as IPointGroup[],
    verseCanonical: '',
    next_verse: '',
    prev_verse: '',
};

const setActivities = (activities: ActivitiesStates) => {};
const setVerseArray = (verseArray: string[]) => {};
const setVerseString = (verseString: string) => {};
const setDoodle = (doodle: IPointGroup[]) => {};
const setVerseCanonical = (verseCanonical: string) => {};
const setNextVerse = (next_verse: string) => {};
const setPrevVerse = (prev_verse: string) => {};

export const StateContext = createContext({...defaultState, setActivities, setVerseArray, setVerseString, setDoodle, setVerseCanonical, setNextVerse, setPrevVerse});

export const StateProvider = ({ children }: Props) => {
  const [state, setState] = useState<State>(defaultState);

  // TODO: use this single space to manage localStoage and database fetching
  const setActivities = (activities: ActivitiesStates) => setState(currentState => ({...currentState, activities: {...activities}}));
  const setVerseArray = (verseArray: string[]) => setState(currentState => ({...currentState, verseIDArray: verseArray}));
  const setVerseString = (verseString: string) => setState(currentState => ({...currentState, verseString }));
  const setDoodle = (doodle: IPointGroup[]) => setState(currentState => ({...currentState, doodle }));
  const setVerseCanonical = (verseCanonical: string) => setState(currentState => ({...currentState, verseCanonical }));
  const setNextVerse = (next_verse: string) => setState(currentState => ({...currentState, next_verse }));
  const setPrevVerse = (prev_verse: string) => setState(currentState => ({...currentState, prev_verse }));

  return (
      <StateContext.Provider value={{...state, setActivities, setVerseArray, setVerseString, setDoodle, setVerseCanonical, setNextVerse, setPrevVerse}}>
          {children}
      </StateContext.Provider>
  );
};