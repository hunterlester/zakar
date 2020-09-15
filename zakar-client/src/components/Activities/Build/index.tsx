import React, { ReactElement, useState, useContext } from 'react';
import { fetchVerse } from 'utils/helpers';
import './Build.css';
import Verse from 'components/Verse';
import { useHistory } from 'react-router-dom';
import { StateContext } from 'StateProvider';

const Build = (): ReactElement => {
  const {
    prev_verse,
    next_verse,
    verseIDArray,
    verseString,
    setVerseString,
    setVerseArray,
    clearState,
    setStandardFetchState,
  } = useContext(StateContext);
  const [isFetching, setIsFetching] = useState(false);
  const history = useHistory();
  const prevVerseId = prev_verse;
  const nextVerseId = next_verse;

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
              setStandardFetchState(verseData);
              verseIDArray.shift();
              setVerseArray(verseIDArray);
              setVerseString(verseData.passages[0]);
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
              setStandardFetchState(verseData);
              verseIDArray.splice(0, 0, prevVerseId);
              setVerseArray(verseIDArray);
              setVerseString(verseData.passages[0]);
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
              setStandardFetchState(verseData);
              verseIDArray.push(nextVerseId);
              setVerseArray(verseIDArray);
              setVerseString(verseData.passages[0]);
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
              setStandardFetchState(verseData);
              verseIDArray.pop();
              setVerseArray(verseIDArray);
              setVerseString(verseData.passages[0]);
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
          clearState();
        }}
        className="ClearVerseButton"
      >
        Clear verse
      </button>
    </>
  );
};

export default Build;
