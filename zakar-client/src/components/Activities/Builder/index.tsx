import React, { ReactElement, Dispatch } from 'react';
import { fetchVerse } from 'utils/helpers';
import './Builder.css';
import Verse from 'components/Verse';
import { ActivityProps } from 'react-app-env';
import { RequestFormat } from 'utils/const';

interface Props {
  setVerse: Dispatch<React.SetStateAction<string>>;
}

const Builder = (props: ActivityProps & Props): ReactElement => {
  const { verseString, setVerse } = props;

  return (
    <>
      <button
        className="LearningBoardButton"
        onClick={async () => {
          try {
            const prevVerseId = localStorage.getItem('prev_verse');
            const verseEnd = localStorage.getItem('verse_end');

            const fetchArgs = {
              verseID: `${prevVerseId}-${verseEnd}`,
              format: RequestFormat.HTML,
              params: {
                'include-headings': false,
                'include-copyright': false,
                'include-short-copyright': true,
                'include-audio-link': false,
                'include-passage-references': true,
                'include-footnotes': false,
              },
            };
            const verseData = await fetchVerse(fetchArgs);
            if (verseData) {
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

      <Verse verseString={verseString} />

      <button
        className="LearningBoardButton"
        onClick={async () => {
          try {
            const verseStart = localStorage.getItem('verse_start');
            const nextVerseId = localStorage.getItem('next_verse');

            const fetchArgs = {
              verseID: `${verseStart}-${nextVerseId}`,
              format: RequestFormat.HTML,
              params: {
                'include-headings': false,
                'include-copyright': false,
                'include-short-copyright': true,
                'include-audio-link': false,
                'include-passage-references': true,
                'include-footnotes': false,
              },
            };
            const verseData = await fetchVerse(fetchArgs);
            if (verseData) {
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
    </>
  );
};

export default Builder;
