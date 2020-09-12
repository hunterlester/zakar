import React, { ReactElement, useState, ChangeEvent, useEffect, useContext } from 'react';
import './Complete.css';
import Verse from 'components/Verse';
import { StateContext } from 'StateProvider';

const Complete = (): ReactElement => {
  const { activities, verseString, setActivities } = useContext(StateContext);
  const [targetText, setTargetText] = useState('');
  const [targetTextArray, setTargetTextArray] = useState<string[]>([]);

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
      uriEncoded = uriEncoded.replace(/%E2%80%9C/g, ''); // double quote
      uriEncoded = uriEncoded.replace(/%E2%80%9D/g, '');
      uriEncoded = uriEncoded.replace(/%E2%80%99/g, ''); // single quote
      uriEncoded = uriEncoded.replace(/%E2%80%98/g, '');
      uriEncoded = uriEncoded.replace(/\./g, '');
      uriEncoded = uriEncoded.replace(/\,/g, '');
      const decodedText = decodeURI(uriEncoded).replace(/\s\s+/g, ' ').trim();
      setTargetText(decodedText);
      setTargetTextArray(decodedText.split(' '));
    }
  }, []);

  useEffect(() => {
    const nextInput = document.querySelector('.CompleteContainer input[class="Incomplete"]') as HTMLInputElement;
    if (nextInput) {
      nextInput.focus();
    }
  }, [targetText]);

  const changeHandler = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    e.currentTarget.style.borderBottom = '1px solid red';
    if (targetTextArray[index].toLowerCase() === e.currentTarget.value.toLowerCase()) {
      e.currentTarget.disabled = true;
      e.currentTarget.style.borderBottom = '1px solid green';
      e.currentTarget.className = '';
    }
    const nextInput = document.querySelector('.CompleteContainer input[class="Incomplete"]') as HTMLInputElement;
    if (nextInput) {
      nextInput.focus();
    }

    const incompleteInputs = Array.from(document.querySelectorAll('.CompleteContainer input')) as HTMLInputElement[];
    const allCompleted = incompleteInputs.every((input) => input.disabled === true);

    if (allCompleted && !!e.currentTarget.value && targetTextArray[index] === e.currentTarget.value) {
      setActivities({ ...activities, Complete: true });
      return;
    }
  };

  return (
    <div className="CompleteContainer">
      <Verse verseString={verseString} />
      {targetText.split(' ').map((text, i) => {
        if ((i + 1) % 3 === 0) {
          return <input key={i} className="Incomplete" disabled={false} onChange={(e) => changeHandler(e, i)} />;
        } else {
          return <p key={i}>&nbsp;{text}&nbsp;</p>;
        }
      })}
      <p>&nbsp;</p>
    </div>
  );
};

export default Complete;
