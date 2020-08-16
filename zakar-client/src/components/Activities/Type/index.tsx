import React, { ReactElement, useState, ChangeEvent, useEffect } from 'react';
import './Type.css';
import { ActivityProps } from 'react-app-env';
import Verse from 'components/Verse';

const Type = (props: ActivityProps): ReactElement => {
  const [targetText, setTargetText] = useState('');
  const [textInputValue, setTextInputValue] = useState('');
  const { verseString, setActivitiesStates } = props;

  useEffect(() => {
    let text = '';
    const textNodes = document.querySelectorAll('.VerseContainer p');
    textNodes.forEach((node) => {
      text += ` ${node.textContent}`;
    });
    if (text) {
      let uriEncoded = encodeURI(text);
      // Replaces non-breaking space with normal space
      uriEncoded = uriEncoded.replace(/%C2%A0/g, '%20');
      uriEncoded = uriEncoded.replace(/%E2%80%9C/g, '%22');
      uriEncoded = uriEncoded.replace(/%E2%80%9D/g, '%22');
      uriEncoded = uriEncoded.replace(/%E2%80%99/g, "'");
      uriEncoded = uriEncoded.replace(/%E2%80%98/g, "'");
      setTargetText(decodeURI(uriEncoded).trim());
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
      setTextInputValue('');
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
