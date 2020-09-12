import React, { useState, createContext, useEffect } from 'react';
import { ActivitiesStates } from 'react-app-env';
import { IPointGroup } from 'signature_pad';
import { getCookie } from 'utils/helpers';

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
  verseText: string;
}

const defaultActivities = {
  Build: false,
  Read: false,
  Recite: false,
  Type: false,
  Listen: false,
  Complete: false,
};

const defaultState = {
  activities: defaultActivities,
  verseIDArray: [] as string[],
  verseString: '',
  doodle: [] as IPointGroup[],
  verseCanonical: '',
  next_verse: '',
  prev_verse: '',
  verseText: '',
};

/* eslint-disable */
const setActivities = (activities: ActivitiesStates) => {};
const setVerseArray = (verseArray: string[]) => {};
const setVerseString = (verseString: string) => {};
const setDoodle = (doodle: IPointGroup[]) => {};
const setVerseCanonical = (verseCanonical: string) => {};
const setNextVerse = (next_verse: string) => {};
const setPrevVerse = (prev_verse: string) => {};
const clearState = () => {};
const setVerseText = (verseText: string) => {};
const setStandardFetchState = (verseData: any) => {};
/* eslint-enable */

export const StateContext = createContext({
  ...defaultState,
  setActivities,
  setVerseArray,
  setVerseString,
  setDoodle,
  setVerseCanonical,
  setNextVerse,
  setPrevVerse,
  clearState,
  setVerseText,
  setStandardFetchState,
});

export const StateProvider = ({ children }: Props) => {
  const [state, setState] = useState<State>(defaultState);

  useEffect(() => {
    const initActivities: ActivitiesStates = JSON.parse(`${localStorage.getItem('activities')}`) || defaultActivities;
    const verseIDArray = localStorage.getItem('verseIDArray');
    const verseString = localStorage.getItem('verseString');
    const doodle = localStorage.getItem('doodle');
    const verseCanonical = localStorage.getItem('verseCanonical');
    const next_verse = localStorage.getItem('next_verse');
    const prev_verse = localStorage.getItem('prev_verse');
    const verseText = localStorage.getItem('verseText');
    const bearerToken = getCookie('bearer');

    const initState = {
      activities: initActivities,
      verseIDArray: verseIDArray ? JSON.parse(verseIDArray) : ([] as string[]),
      verseString: verseString || '',
      doodle: doodle ? JSON.parse(doodle) : ([] as IPointGroup[]),
      verseCanonical: verseCanonical || '',
      next_verse: next_verse || '',
      prev_verse: prev_verse || '',
      verseText: verseText || '',
    };

    setState({ ...initState });

    // then make database call if bearerToken
  }, []);

  // TODO: use this single space to manage localStoage and database fetching
  const setActivities = (activities: ActivitiesStates) => {
    localStorage.setItem('activities', JSON.stringify(activities));
    setState((currentState) => ({ ...currentState, activities: { ...activities } }));
  };
  const setVerseArray = (verseArray: string[]) => {
    localStorage.setItem('verseIDArray', JSON.stringify(verseArray));
    setState((currentState) => ({ ...currentState, verseIDArray: verseArray }));
  };
  const setVerseString = (verseString: string) => {
    localStorage.setItem('verseString', verseString);
    setState((currentState) => ({ ...currentState, verseString }));
  };
  const setDoodle = (doodle: IPointGroup[]) => {
    localStorage.setItem('doodle', JSON.stringify(doodle));
    setState((currentState) => ({ ...currentState, doodle }));
  };
  const setVerseCanonical = (verseCanonical: string) => {
    localStorage.setItem('verseCanonical', verseCanonical);
    setState((currentState) => ({ ...currentState, verseCanonical }));
  };
  const setNextVerse = (next_verse: string) => {
    localStorage.setItem('next_verse', next_verse);
    setState((currentState) => ({ ...currentState, next_verse }));
  };
  const setPrevVerse = (prev_verse: string) => {
    localStorage.setItem('prev_verse', prev_verse);
    setState((currentState) => ({ ...currentState, prev_verse }));
  };
  const clearState = () => {
    localStorage.clear();
    setState({ ...defaultState });
  };
  const setVerseText = (verseText: string) => {
    localStorage.setItem('verseText', verseText);
    setState((currentState) => ({ ...currentState, verseText }));
  };
  const setStandardFetchState = (verseData: any) => {
    setVerseCanonical(verseData.canonical);
    setNextVerse(verseData.passage_meta[0].next_verse);
    setPrevVerse(verseData.passage_meta[0].prev_verse);
  };

  return (
    <StateContext.Provider
      value={{
        ...state,
        setActivities,
        setVerseArray,
        setVerseString,
        setDoodle,
        setVerseCanonical,
        setNextVerse,
        setPrevVerse,
        clearState,
        setVerseText,
        setStandardFetchState,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};
