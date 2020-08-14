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

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      // console.log(event);
      const speechResult = event.results[this.state.transcriptWords.length][0].transcript.toLowerCase();
      // console.log('Speech result', encodeURI(speechResult));
      // console.log('Target text', encodeURI(targetText));

      // console.log('Confidence: ' + event.results[0][0].confidence);

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
        text += ` ${node.textContent}`;
      }
    });
    if (!!text) {
      const uriEncoded = encodeURI(text);
      // Replaces non-breaking space with normal space
      const nonBreakSpaceReplaced = uriEncoded.replace(/%C2%A0/g, '%20');
      let decodedURIEncoded = decodeURI(nonBreakSpaceReplaced);
      decodedURIEncoded = decodedURIEncoded
        .replace(/,|\.|\u201c|\u201d|\!/g, '')
        .toLowerCase()
        .trim();
      // console.log(decodedURIEncoded);
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
            <Verse verseString={verseString} />
            <button disabled={this.state.isRecording} className="RecordingButton" onClick={() => this.startHandler()}>
              Start
            </button>
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
