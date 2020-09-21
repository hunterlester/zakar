import { AxiosResponse } from 'axios';
import React, { useState, createContext, useEffect, useRef } from 'react';
import { ActivitiesStates } from 'react-app-env';
import { useHistory } from 'react-router-dom';
import { IPointGroup } from 'signature_pad';
import { fetchVerse, getCookie, getUserVerses, updateUserVerses } from 'utils/helpers';

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

interface DashboardState {
  completedVerses: string[];
}

const defaultDashboardState = {
  completedVerses: [] as string[],
};

const defaultActivities = {
  Build: true,
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
const setCompletedVerses = (verseStringArray: string[]) => {};
const fetchCompletedVerses = () => {};
/* eslint-enable */

export const StateContext = createContext({
  ...defaultState,
  ...defaultDashboardState,
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
  setCompletedVerses,
  fetchCompletedVerses,
});

export const StateProvider = ({ children }: Props) => {
  const [state, setState] = useState<State>(defaultState);
  const [dashboardState, setDashboardState] = useState<DashboardState>(defaultDashboardState);
  const history = useHistory();
  const isFetching = useRef(false);

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
    localStorage.setItem('next_verse', JSON.stringify(next_verse));
    setState((currentState) => ({ ...currentState, next_verse: JSON.stringify(next_verse) }));
  };
  const setPrevVerse = (prev_verse: string) => {
    localStorage.setItem('prev_verse', JSON.stringify(prev_verse));
    setState((currentState) => ({ ...currentState, prev_verse: JSON.stringify(prev_verse) }));
  };
  const clearState = () => {
    Object.keys(defaultState).forEach((key) => {
      localStorage.removeItem(key);
    });
    setState({ ...defaultState });
    history.push('/');
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
  const setCompletedVerses = (verseStringArray: string[]) => {
    const completedVerses: string[] = [...verseStringArray];
    localStorage.setItem('completedVerses', JSON.stringify(completedVerses));
    setDashboardState((currentState) => ({ ...currentState, completedVerses }));
  };
  const fetchCompletedVerses = () => {
    const userID = getCookie('user_id');
    const completedVerses = localStorage.getItem('completedVerses');

    if (!!completedVerses) {
      const parsedCompletedVerses: string[] = JSON.parse(completedVerses);
      setCompletedVerses(parsedCompletedVerses);
    } else {
      if (userID) {
        getUserVerses(userID)
          .then(async (response: AxiosResponse) => {
            const verseIDs: string[] = response.data;

            const verseData = await fetchVerse({ verseCanonical: verseIDs.join(',') });
            if (verseData) {
              setCompletedVerses(verseData.passages);
            }
          })
          .catch((err) => {
            console.error(err);
            // TODO: if error, try to update users verses again somehow
            // possibly prompting client
          });
      }
    }
  };

  const { activities, verseIDArray } = state;

  useEffect(() => {
    const initActivities: ActivitiesStates = JSON.parse(`${localStorage.getItem('activities')}`) || defaultActivities;
    const verseIDArray = localStorage.getItem('verseIDArray');
    const verseString = localStorage.getItem('verseString');
    const doodle = localStorage.getItem('doodle');
    const verseCanonical = localStorage.getItem('verseCanonical');
    const next_verse = localStorage.getItem('next_verse');
    const prev_verse = localStorage.getItem('prev_verse');
    const verseText = localStorage.getItem('verseText');

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
    setDashboardState({ ...defaultDashboardState });
  }, []);

  useEffect(() => {
    const allActivitiesCompleted = Object.values(activities).every((value) => value === true);
    const bearerToken = getCookie('bearer');
    const userID = getCookie('user_id');
    if (allActivitiesCompleted && bearerToken && userID && !isFetching.current) {
      isFetching.current = true;
      updateUserVerses(userID, JSON.stringify(verseIDArray))
        .then(async (response) => {
          isFetching.current = false;
          if (response.status === 200) {
            getUserVerses(userID)
              .then(async (response: AxiosResponse) => {
                const verseIDs: string[] = response.data;

                const verseData = await fetchVerse({ verseCanonical: verseIDs.join(',') });
                if (verseData) {
                  setCompletedVerses(verseData.passages);
                  clearState();
                  history.push('/dashboard');
                }
              })
              .catch((err) => {
                console.error(err);
                // TODO: if error, try to update users verses again somehow
                // possibly prompting client
              });
          }
        })
        .catch((err) => {
          isFetching.current = false;
          console.error(err);
          // TODO: if error, try to update users verses again somehow
          // possibly prompting client
        });
    }

    if (allActivitiesCompleted && !bearerToken) {
      history.push('/login-cta');
    }
  }, [activities]);

  return (
    <StateContext.Provider
      value={{
        ...state,
        ...dashboardState,
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
        setCompletedVerses,
        fetchCompletedVerses,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};
