import React, { ReactElement } from 'react';
import './Recite.css';
import { ActivityProps } from 'react-app-env';
import Verse from 'components/Verse';

// Reference: https://developers.google.com/web/fundamentals/media/recording-audio

interface State {
  isRecording: boolean;
  targetText: string;
  transcriptWords: string[];
  inaccurateRecite: boolean;
  accurateRecite: boolean;
}

class Recite extends React.PureComponent<ActivityProps, State> {
  constructor(props: ActivityProps) {
    super(props);
    this.state = {
      isRecording: false,
      targetText: '',
      transcriptWords: [],
      inaccurateRecite: false,
      accurateRecite: false,
    };
  }

  startHandler = (): void => {
    const { setActivitiesStates } = this.props;

    this.setState({
      ...this.state,
      isRecording: true,
      transcriptWords: [],
      inaccurateRecite: false,
      accurateRecite: false,
    });

    // https://github.com/mdn/web-speech-api/blob/master/phrase-matcher/script.js
    const SpeechRecognition = window.webkitSpeechRecognition;
    const SpeechGrammarList = window.webkitSpeechGrammarList;
    const SpeechRecognitionEvent = window.webkitSpeechRecognitionEvent;

    const grammar = '#JSGF V1.0; grammar phrase; public <phrase> = ' + this.state.targetText + ';';
    const recognition = new SpeechRecognition();
    const speechRecognitionList = new SpeechGrammarList();
    speechRecognitionList.addFromString(grammar, 1);
    recognition.grammars = speechRecognitionList;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = true;

    recognition.start();

    recognition.onend = () => {
      if (!this.state.targetText.includes(this.state.transcriptWords.join(' '))) {
        this.setState({ ...this.state, isRecording: false, inaccurateRecite: true });
        recognition.stop();
        return;
      }

      if (this.state.transcriptWords.join(' ') === this.state.targetText) {
        this.setState({ ...this.state, isRecording: false, accurateRecite: true });
        recognition.stop();
        const activities = JSON.parse(`${localStorage.getItem('activities')}`);
        activities['Recite'] = true;
        localStorage.setItem('activities', JSON.stringify(activities));
        setActivitiesStates(activities);
        return;
      }
      // console.log('restarting speech recognition');
      recognition.start();
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      // console.log(event);
      // console.log('this.state.transcriptWords.length: ', this.state.transcriptWords);
      let speechResult = event.results[event.resultIndex][0].transcript.toLowerCase();
      // console.log('Speech result', encodeURI(speechResult));
      // console.log('Target text', encodeURI(targetText));

      // console.log('Confidence: ' + event.results[0][0].confidence);

      speechResult = speechResult.replace(/worshipped/g, 'worshiped');
      this.setState({ ...this.state, transcriptWords: [...this.state.transcriptWords, speechResult.trim()] });
      // console.log(this.state.transcriptWords.join(" "));

      if (!this.state.targetText.includes(this.state.transcriptWords.join(' '))) {
        this.setState({ ...this.state, isRecording: false, inaccurateRecite: true });
        recognition.stop();
      }

      if (this.state.transcriptWords.join(' ') === this.state.targetText) {
        // console.log('they are equal!!!!!!!!!!!!!!!!!!');
        this.setState({ ...this.state, isRecording: false, accurateRecite: true });
        recognition.stop();
        const activities = JSON.parse(`${localStorage.getItem('activities')}`);
        activities['Recite'] = true;
        localStorage.setItem('activities', JSON.stringify(activities));
        setActivitiesStates(activities);
      }
    };

    recognition.onerror = (event: SpeechRecognitionEvent) => {
      console.error('Speech error: ', event);
    };
  };

  componentDidMount(): void {
    let text = '';
    const textNodes = document.querySelectorAll('.VerseContainer p');
    textNodes.forEach((node) => {
      if (node.textContent !== '(ESV)') {
        node.querySelectorAll('.verse-num').forEach((verseNode) => {
          verseNode.remove();
        });
        node.querySelectorAll('.chapter-num').forEach((verseNode) => {
          verseNode.remove();
        });
        text += ` ${node.textContent}`;
      }
    });
    if (!!text) {
      let uriEncoded = encodeURI(text);
      // Replaces non-breaking space with normal space
      uriEncoded = uriEncoded.replace(/%C2%A0/g, '%20');
      uriEncoded = uriEncoded.replace(/%E2%80%9C/g, '');
      uriEncoded = uriEncoded.replace(/%E2%80%9D/g, '');
      uriEncoded = uriEncoded.replace(/%E2%80%99/g, '%27');
      uriEncoded = uriEncoded.replace(/%E2%80%98/g, '%27');
      uriEncoded = uriEncoded.replace(/\!/g, '');
      uriEncoded = uriEncoded.replace(/\?/g, '');
      uriEncoded = uriEncoded.replace(/\;/g, '');
      let decodedURIEncoded = decodeURI(uriEncoded);
      decodedURIEncoded = decodedURIEncoded
        .replace(/,|\.|\u201c|\u201d|\!/g, '')
        .replace(/\s\s+/g, ' ')
        .toLowerCase()
        .trim();
      // console.log(encodeURI(decodedURIEncoded));
      this.setState({ ...this.state, targetText: decodedURIEncoded });
    }
  }

  render(): ReactElement {
    const { verseString } = this.props;
    return (
      <div>
        {!window.webkitSpeechRecognition && (
          <p className="UserAgentMessage">
            Activity only supported on Google Chrome or Microsoft Edge.
            <br /> Change browser to unlock.
          </p>
        )}
        {window.webkitSpeechRecognition && (
          <>
            <button disabled={this.state.isRecording} className="RecordingButton" onClick={() => this.startHandler()}>
              {this.state.isRecording ? 'Recording...' : 'Start'}
            </button>
            {!this.state.isRecording && <Verse verseString={verseString} />}
            {this.state.transcriptWords && (
              <p
                className={`TranscriptWord ${this.state.inaccurateRecite ? 'InaccurateRecite' : ''} ${
                  this.state.accurateRecite ? 'AccurateRecite' : ''
                }`}
              >
                {this.state.transcriptWords.join(' ')}
              </p>
            )}
          </>
        )}
      </div>
    );
  }
}

export default Recite;
