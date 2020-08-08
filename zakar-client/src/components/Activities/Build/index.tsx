import React, { ReactElement, Dispatch } from 'react';
import { fetchVerse } from 'utils/helpers';
import './Build.css';
import Verse from 'components/Verse';
import { ActivityProps } from 'react-app-env';
import { RequestFormat } from 'utils/const';

interface Props {
  setVerse: Dispatch<React.SetStateAction<string>>;
}

const Build = (props: ActivityProps & Props): ReactElement => {
  const { verseString, setVerse } = props;
  const prevVerseId = localStorage.getItem('prev_verse');
  const nextVerseId = localStorage.getItem('next_verse');
  const verseStart = localStorage.getItem('verse_start');
  const verseEnd = localStorage.getItem('verse_end');

  return (
    <>
      <Verse verseString={verseString} />

      <button
        className="LearningBoardButton"
        disabled={Number(verseEnd) - Number(verseStart) < 1}
        onClick={async () => {
          try {
            const fetchArgs = {
              verseID: `${Number(verseStart) + 1}-${verseEnd}`,
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
        Remove First Verse
      </button>

      <button
        className="LearningBoardButton"
        onClick={async () => {
          try {
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

      <button
        className="LearningBoardButton"
        onClick={async () => {
          try {
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

      <button
        className="LearningBoardButton"
        disabled={Number(verseEnd) - Number(verseStart) < 1}
        onClick={async () => {
          try {
            const fetchArgs = {
              verseID: `${verseStart}-${Number(verseEnd) - 1}`,
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
        Remove Last Verse
      </button>
    </>
  );
};

export default Build;
