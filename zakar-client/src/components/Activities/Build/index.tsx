import React, { ReactElement, Dispatch, useState, useEffect, useRef } from 'react';
import { fetchVerse } from 'utils/helpers';
import './Build.css';
import Verse from 'components/Verse';
import { ActivityProps } from 'react-app-env';
import { useHistory } from 'react-router-dom';
import { Activities } from 'utils/const';

interface Props {
  setVerse: Dispatch<React.SetStateAction<string>>;
}

const Build = (props: ActivityProps & Props): ReactElement => {
  const { verseString, setVerse, setActivitiesStates } = props;
  const [isFetching, setIsFetching] = useState(false);
  const isInitialMount = useRef(true);
  const history = useHistory();
  const prevVerseId = localStorage.getItem('prev_verse');
  const nextVerseId = localStorage.getItem('next_verse');
  const verseIDArray = JSON.parse(`${localStorage.getItem('verseIDArray')}`);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      let activities = JSON.parse(`${localStorage.getItem('activities')}`);
      if (!activities) {
        Object.keys(Activities).forEach((activity: string) => {
          if (!Number.isInteger(Number(activity)) && activity) {
            activities = { ...activities, [activity]: activity === 'Build' ? true : false };
          }
        });
      }

      localStorage.setItem('activities', JSON.stringify(activities));
      setActivitiesStates(activities);
    }
  }, [verseString]);

  return (
    <>
      <button
        className="LearningBoardButton"
        disabled={(verseIDArray && verseIDArray.length < 2) || isFetching}
        onClick={async () => {
          try {
            const fetchArgs = {
              verseCanonical: `${verseIDArray[1]}-${verseIDArray[verseIDArray.length - 1]}`,
            };
            setIsFetching(true);
            const verseData = await fetchVerse(fetchArgs);
            if (verseData) {
              verseIDArray.shift();
              localStorage.setItem('verseIDArray', JSON.stringify(verseIDArray));
              localStorage.setItem('verseString', verseData.passages[0]);
              setVerse(verseData.passages[0]);
              setIsFetching(false);
            }
          } catch (error) {
            // TODO: log error
            if (error.response && /login_cta/.test(error.response.headers.location)) {
              return history.push('/login-cta');
            }
            console.error(error);
            setIsFetching(false);
          }
        }}
      >
        Remove first verse
      </button>

      <button
        disabled={isFetching}
        className="LearningBoardButton"
        onClick={async () => {
          try {
            const fetchArgs = {
              verseCanonical: `${prevVerseId}-${verseIDArray[verseIDArray.length - 1]}`,
            };
            setIsFetching(true);
            const verseData = await fetchVerse(fetchArgs);
            if (verseData) {
              verseIDArray.splice(0, 0, prevVerseId);
              localStorage.setItem('verseIDArray', JSON.stringify(verseIDArray));
              localStorage.setItem('verseString', verseData.passages[0]);
              setVerse(verseData.passages[0]);
              setIsFetching(false);
            }
          } catch (error) {
            // TODO: log error
            if (error.response && /login_cta/.test(error.response.headers.location)) {
              return history.push('/login-cta');
            }
            console.error(error);
            setIsFetching(false);
          }
        }}
      >
        Add preceding verse
      </button>

      <button
        disabled={isFetching}
        className="LearningBoardButton"
        onClick={async () => {
          try {
            const fetchArgs = {
              verseCanonical: `${verseIDArray[0]}-${nextVerseId}`,
            };
            setIsFetching(true);
            const verseData = await fetchVerse(fetchArgs);
            if (verseData) {
              verseIDArray.push(nextVerseId);
              localStorage.setItem('verseIDArray', JSON.stringify(verseIDArray));
              localStorage.setItem('verseString', verseData.passages[0]);
              setVerse(verseData.passages[0]);
              setIsFetching(false);
            }
          } catch (error) {
            // TODO: log error
            if (error.response && /login_cta/.test(error.response.headers.location)) {
              return history.push('/login-cta');
            }
            console.error(error);
            setIsFetching(false);
          }
        }}
      >
        Add next verse
      </button>

      <button
        className="LearningBoardButton"
        disabled={(verseIDArray && verseIDArray.length < 2) || isFetching}
        onClick={async () => {
          try {
            const fetchArgs = {
              verseCanonical: `${verseIDArray[0]}-${verseIDArray[verseIDArray.length - 2]}`,
            };
            setIsFetching(true);
            const verseData = await fetchVerse(fetchArgs);
            if (verseData) {
              verseIDArray.pop();
              localStorage.setItem('verseIDArray', JSON.stringify(verseIDArray));
              localStorage.setItem('verseString', verseData.passages[0]);
              setVerse(verseData.passages[0]);
              setIsFetching(false);
            }
          } catch (error) {
            // TODO: log error
            if (error.response && /login_cta/.test(error.response.headers.location)) {
              return history.push('/login-cta');
            }
            console.error(error);
            setIsFetching(false);
          }
        }}
      >
        Remove last verse
      </button>

      <Verse verseString={verseString} />

      <button
        disabled={isFetching}
        key="clear-verse"
        onClick={() => {
          localStorage.clear();
          history.push('/');
        }}
        className="ClearVerseButton"
      >
        Clear verse
      </button>
    </>
  );
};

export default Build;
