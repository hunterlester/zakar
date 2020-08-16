import React, { ReactElement, Dispatch, useState } from 'react';
import { fetchVerse } from 'utils/helpers';
import './Build.css';
import Verse from 'components/Verse';
import { ActivityProps } from 'react-app-env';
import { useHistory } from 'react-router-dom';

interface Props {
  setVerse: Dispatch<React.SetStateAction<string>>;
}

const Build = (props: ActivityProps & Props): ReactElement => {
  const { verseString, setVerse } = props;
  const [isFetching, setIsFetching] = useState(false);
  const history = useHistory();
  const prevVerseId = localStorage.getItem('prev_verse');
  const nextVerseId = localStorage.getItem('next_verse');
  const verseIDArray = JSON.parse(`${localStorage.getItem('verseIDArray')}`);

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
            console.error(error);
            setIsFetching(false);
          }
        }}
      >
        Remove First Verse
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
            console.error(error);
            setIsFetching(false);
          }
        }}
      >
        Add Previous Verse
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
            console.error(error);
            setIsFetching(false);
          }
        }}
      >
        Add Next Verse
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
            console.error(error);
            setIsFetching(false);
          }
        }}
      >
        Remove Last Verse
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
        Clear Verse
      </button>
    </>
  );
};

export default Build;
