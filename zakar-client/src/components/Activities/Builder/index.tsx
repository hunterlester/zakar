import React, { ReactElement, Dispatch } from 'react';
import { fetchVerse } from 'utils/helpers';
import './Builder.css';
import Verse from 'components/Verse';
import { ActivityProps } from 'react-app-env';

interface Props {
  setVerseArray: Dispatch<React.SetStateAction<any[]>>;
}

const Builder = (props: ActivityProps & Props): ReactElement => {
  const { verses, setVerseArray } = props;

  return (
    <>
      <button
        className="LearningBoardButton"
        onClick={async () => {
          try {
            let verses = JSON.parse(`${localStorage.getItem('versesID')}`);
            let verseData = await fetchVerse(verses[0]);
            verses = [verseData.previous.id, ...verses];
            localStorage.setItem('versesID', JSON.stringify(verses));

            verseData = await fetchVerse(verseData.previous.id);
            if (verseData) {
              setVerseArray((prevArray: string[]) => [verseData, ...prevArray]);
            }
          } catch (error) {
            // TODO: log error
            console.error(error);
          }
        }}
      >
        Add Previous Verse
      </button>

      <Verse verses={verses} />

      <button
        className="LearningBoardButton"
        onClick={async () => {
          try {
            let verses = JSON.parse(`${localStorage.getItem('versesID')}`);
            let verseData = await fetchVerse(verses[verses.length - 1]);
            verses = [...verses, verseData.next.id];
            localStorage.setItem('versesID', JSON.stringify(verses));

            verseData = await fetchVerse(verseData.next.id);
            if (verseData) {
              setVerseArray((prevArray) => [...prevArray, verseData]);
            }
          } catch (error) {
            // TODO: log error
            console.error(error);
          }
        }}
      >
        Add Next Verse
      </button>
      {verses.length && <div className="VerseCopyright">{verses[0].copyright}</div>}
    </>
  );
};

export default Builder;
