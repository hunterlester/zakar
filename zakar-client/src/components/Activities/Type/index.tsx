import React, { ReactElement, useState, ChangeEvent, useEffect, useContext } from 'react';
import './Type.css';
import Verse from 'components/Verse';
import { StateContext } from 'StateProvider';

const Type = (): ReactElement => {
  const { setActivities, activities, verseString } = useContext(StateContext);
  const [targetText, setTargetText] = useState('');
  const [textInputValue, setTextInputValue] = useState('');

  useEffect(() => {
    let text = '';
    const textNodes = document.querySelectorAll('.VerseContainer p');
    textNodes.forEach((node) => {
      node.querySelectorAll('.verse-num').forEach((verseNode) => {
        verseNode.remove();
      });
      node.querySelectorAll('.chapter-num').forEach((verseNode) => {
        verseNode.remove();
      });
      text += ` ${node.textContent}`;
    });
    if (text) {
      let uriEncoded = encodeURI(text);
      // Replaces non-breaking space with normal space
      uriEncoded = uriEncoded.replace(/%C2%A0/g, '%20');
      uriEncoded = uriEncoded.replace(/%E2%80%9C/g, '%22'); // double quote
      uriEncoded = uriEncoded.replace(/%E2%80%9D/g, '%22');
      uriEncoded = uriEncoded.replace(/%E2%80%99/g, '%27'); // single quote
      uriEncoded = uriEncoded.replace(/%E2%80%98/g, '%27');
      setTargetText(decodeURI(uriEncoded).replace(/\s\s+/g, ' ').trim());
    }
  }, []);

  const changeHandler = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setTextInputValue(value);
    if (value === targetText) {
      setActivities({ ...activities, Type: true });
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
