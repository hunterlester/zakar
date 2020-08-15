import React, { ReactElement, Dispatch } from 'react';
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
  const history = useHistory();
  const prevVerseId = localStorage.getItem('prev_verse');
  const nextVerseId = localStorage.getItem('next_verse');
  const verseIDArray = JSON.parse(`${localStorage.getItem('verseIDArray')}`);

  return (
    <>
      <Verse verseString={verseString} />

      <button
        className="LearningBoardButton"
        disabled={verseIDArray.length < 2}
        onClick={async () => {
          try {
            const fetchArgs = {
              verseCanonical: `${verseIDArray[1]}-${verseIDArray[verseIDArray.length - 1]}`,
            };
            const verseData = await fetchVerse(fetchArgs);
            if (verseData) {
              verseIDArray.shift();
              localStorage.setItem('verseIDArray', JSON.stringify(verseIDArray));
              localStorage.setItem('verseString', verseData.passages[0]);
              setVerse(verseData.passages[0]);
            }
          } catch (error) {
            // TODO: log error
            console.error(error);
          }
        }}
      >
        Remove First Verse
      </button>

      <button
        className="LearningBoardButton"
        onClick={async () => {
          try {
            const fetchArgs = {
              verseCanonical: `${prevVerseId}-${verseIDArray[verseIDArray.length - 1]}`,
            };
            const verseData = await fetchVerse(fetchArgs);
            if (verseData) {
              verseIDArray.splice(0, 0, prevVerseId);
              localStorage.setItem('verseIDArray', JSON.stringify(verseIDArray));
              localStorage.setItem('verseString', verseData.passages[0]);
              setVerse(verseData.passages[0]);
            }
          } catch (error) {
            // TODO: log error
            console.error(error);
          }
        }}
      >
        Add Previous Verse
      </button>

      <button
        className="LearningBoardButton"
        onClick={async () => {
          try {
            const fetchArgs = {
              verseCanonical: `${verseIDArray[0]}-${nextVerseId}`,
            };
            const verseData = await fetchVerse(fetchArgs);
            if (verseData) {
              verseIDArray.push(nextVerseId);
              localStorage.setItem('verseIDArray', JSON.stringify(verseIDArray));
              localStorage.setItem('verseString', verseData.passages[0]);
              setVerse(verseData.passages[0]);
            }
          } catch (error) {
            // TODO: log error
            console.error(error);
          }
        }}
      >
        Add Next Verse
      </button>

      <button
        className="LearningBoardButton"
        disabled={verseIDArray.length < 2}
        onClick={async () => {
          try {
            const fetchArgs = {
              verseCanonical: `${verseIDArray[0]}-${verseIDArray[verseIDArray.length - 2]}`,
            };
            console.log('fetchArgs: ', fetchArgs);
            const verseData = await fetchVerse(fetchArgs);
            if (verseData) {
              console.log(verseData);
              verseIDArray.pop();
              localStorage.setItem('verseIDArray', JSON.stringify(verseIDArray));
              localStorage.setItem('verseString', verseData.passages[0]);
              setVerse(verseData.passages[0]);
            }
          } catch (error) {
            // TODO: log error
            console.error(error);
          }
        }}
      >
        Remove Last Verse
      </button>

      <button
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
