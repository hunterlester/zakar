import React, { ReactElement, Dispatch } from 'react';
import { fetchVerse } from 'utils/helpers';
import './Builder.css';
import Verse from 'components/Verse';
import { ActivityProps } from 'react-app-env';

interface Props {
  setVerse: Dispatch<React.SetStateAction<string>>;
}

const Builder = (props: ActivityProps & Props): ReactElement => {
  const { verseString, setVerse} = props;

  return (
    <>
      <button
        className="LearningBoardButton"
        onClick={async () => {
          try {
            const prevVerseId = localStorage.getItem('prev_verse');
            const verseEnd = localStorage.getItem('verse_end');

            const verseData = await fetchVerse(`${prevVerseId}-${verseEnd}`);
            if (verseData) {
              setVerse((verseData.passages[0]));
            }
          } catch (error) {
            // TODO: log error
            console.error(error);
          }
        }}
      >
        Add Previous Verse
      </button>

      <Verse verseString={verseString} />

      <button
        className="LearningBoardButton"
        onClick={async () => {
          try {
            const verseStart = localStorage.getItem('verse_start');
            const nextVerseId = localStorage.getItem('next_verse');

            const verseData = await fetchVerse(`${verseStart}-${nextVerseId}`);
            if (verseData) {
              setVerse((verseData.passages[0]));
            }
          } catch (error) {
            // TODO: log error
            console.error(error);
          }
        }}
      >
        Add Next Verse
      </button>
      { /* verses.length && <div className="VerseCopyright">{verses[0].copyright}</div> */}
    </>
  );
};

export default Builder;
