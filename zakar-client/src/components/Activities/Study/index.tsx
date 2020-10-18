import React, { ReactElement, useContext, useEffect, useState } from 'react';
import { StateContext } from 'StateProvider';
import './Study.css';

const StepBibleFrame = () => {
  const { verseCanonical } = useContext(StateContext);
  const verseSplit = verseCanonical.split(' ');
  const book = verseSplit.length === 3 ? `${verseSplit[0]}${verseSplit[1]}` : verseSplit[0];
  const chapterAndVerse = verseSplit[verseSplit.length - 1].split(':');
  const chapter = chapterAndVerse[0];
  const verse = chapterAndVerse[1].split(/\D/);
  return (
    <iframe
      title="STEP Bible"
      src={`https://www.stepbible.org/?q=version=ESV|reference=${book}${chapter}.${verse[0]}-${book}${chapter}.${
        verse[verse.length - 1]
      }`}
    ></iframe>
  );
};

const BlueLetterBibleFrame = () => {
  const { verseCanonical } = useContext(StateContext);
  const verseSplit = verseCanonical.split(' ');
  const book = verseSplit.length === 3 ? `${verseSplit[0]}${verseSplit[1]}` : verseSplit[0];
  const chapterAndVerse = verseSplit[verseSplit.length - 1].split(':');
  const chapter = chapterAndVerse[0];
  return <iframe src={`https://www.blueletterbible.org/esv/${book}/${chapter}/${chapterAndVerse[1]}`}></iframe>;
};

enum View {
  BlueLetter,
  Step,
}

const switchView = (view: View): ReactElement => {
  switch (view) {
    case View.BlueLetter:
      return <BlueLetterBibleFrame />;
    case View.Step:
      return <StepBibleFrame />;
    default:
      return <StepBibleFrame />;
  }
};

const Study = (): ReactElement => {
  const { setActivities, activities } = useContext(StateContext);
  const [view, setView] = useState(View.Step);

  useEffect(() => {
    setActivities({ ...activities, Study: true });
  }, []);

  return (
    <div>
      <div className="StudyButtonsContainer">
        <button
          className={`StudyButton ${view === View.Step ? 'ActiveButton' : ''}`}
          onClick={() => setView(View.Step)}
        >
          STEP Bible
        </button>
        <button
          className={`StudyButton ${view === View.BlueLetter ? 'ActiveButton' : ''}`}
          onClick={() => setView(View.BlueLetter)}
        >
          Blue Letter Bible
        </button>
      </div>
      <div className="IFrame">{switchView(view)}</div>
    </div>
  );
};

export default Study;
