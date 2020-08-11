import React, { ReactElement, useState, useEffect } from 'react';
import './Recite.css';
import { ActivityProps } from 'react-app-env';
import Verse from 'components/Verse';

// Reference: https://developers.google.com/web/fundamentals/media/recording-audio

const Recite = (props: ActivityProps): ReactElement => {
  const [targetText, setTargetText] = useState<string>('');
  const [isRecording, setIsRecording] = useState(false);
  const [transcriptWords, setTranscriptWords] = useState<string>('');
  const { verseString } = props;

  useEffect(() => {
    let text = '';
    const textNodes = document.querySelectorAll('.VerseContainer p');
    textNodes.forEach((node) => {
      if (node.textContent !== '(ESV)') {
        // TODO: edge case only pulls text from last child
        text += ` ${node.lastChild!.textContent}`;
      }
    });
    if (!!text) {
      const uriEncoded = encodeURI(text);
      // Replaces non-breaking space with normal space
      const nonBreakSpaceReplaced = uriEncoded.replace(/%C2%A0/g, '%20');
      let decodedURIEncoded = decodeURI(nonBreakSpaceReplaced);
      // TODO: go back to matching verse nums
      decodedURIEncoded = decodedURIEncoded.replace(/,|\./g, '').toLowerCase().trim();
      console.log(decodedURIEncoded);
      setTargetText(decodedURIEncoded);
    }
  }, []);

  const startHandler = () => {
    setIsRecording(true);

    // https://github.com/mdn/web-speech-api/blob/master/phrase-matcher/script.js
    const SpeechRecognition = window.webkitSpeechRecognition;
    const SpeechGrammarList = window.webkitSpeechGrammarList;
    const SpeechRecognitionEvent = window.webkitSpeechRecognitionEvent;

    const grammar = '#JSGF V1.0; grammar phrase; public <phrase> = ' + targetText + ';';
    const recognition = new SpeechRecognition();
    const speechRecognitionList = new SpeechGrammarList();
    speechRecognitionList.addFromString(grammar, 1);
    recognition.grammars = speechRecognitionList;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();

    recognition.onresult = function (event: SpeechRecognitionEvent) {
      console.log(event);
      const speechResult = event.results[0][0].transcript.toLowerCase();
      console.log('Speech result', encodeURI(speechResult));
      console.log('Target text', encodeURI(targetText));

      console.log('Confidence: ' + event.results[0][0].confidence);

      setTranscriptWords(speechResult);

      if (speechResult === targetText) {
        console.log('they are equal!!!!!!!!!!!!!!!!!!');
        const activities = JSON.parse(`${localStorage.getItem('activities')}`);
        activities['Recite'] = true;
        localStorage.setItem('activities', JSON.stringify(activities));
      }
    };

    recognition.onspeechend = function () {
      setIsRecording(false);
      recognition.stop();
    };

    recognition.onerror = function (event: SpeechRecognitionEvent) {
      console.log('Speech error: ', event);
    };
  };

  return (
    <div>
      <Verse verseString={verseString} />
      <button disabled={isRecording} className="RecordingButton" onClick={() => startHandler()}>
        Start
      </button>
      {transcriptWords && <p className="TranscriptWord">{transcriptWords}</p>}
    </div>
  );
};

export default Recite;
