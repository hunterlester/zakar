import React, { ReactElement, useState, ChangeEvent, useEffect } from 'react';
import './Type.css';
import { ActivityProps } from 'react-app-env';
import Verse from 'components/Verse';

const Type = (props: ActivityProps): ReactElement => {
  const [targetText, setTargetText] = useState('');
  const [textInputValue, setTextInputValue] = useState('');
  const { verseString, setActivitiesStates } = props;

  useEffect(() => {
    const text = document.querySelector('.VerseContainer p');
    if (text && text.textContent) {
      const uriEncoded = encodeURI(text.textContent);
      // Replaces non-breaking space with normal space
      const nonBreakSpaceReplaced = uriEncoded.replace(/%C2%A0/, '%20');
      setTargetText(decodeURI(nonBreakSpaceReplaced));
    }
  }, []);

  const changeHandler = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setTextInputValue(value);
    if (value === targetText) {
      const activities = JSON.parse(`${localStorage.getItem('activities')}`);
      activities['Type'] = true;
      localStorage.setItem('activities', JSON.stringify(activities));
      setActivitiesStates(activities);
    }
  };

  return (
    <div>
      <Verse verseString={verseString} />
      <textarea value={textInputValue} onChange={changeHandler} autoFocus={true} className="TypingInput" />
    </div>
  );
};

export default Type;
