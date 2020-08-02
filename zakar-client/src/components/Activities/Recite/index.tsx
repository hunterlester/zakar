import React, { ReactElement, Ref, useRef, useState } from 'react';
import axios from 'axios';
import './Recite.css';

// Reference: https://developers.google.com/web/fundamentals/media/recording-audio

const Recite = (): ReactElement => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcriptWords, setTranscriptWords] = useState<string>('');
  const stopButtonEl: Ref<HTMLButtonElement> = useRef(document.createElement('button'));

  const startHandler = () => {
    const handleSuccess = (stream: any) => {
      const recordedChunks: any[] = [];
      setIsRecording(true);

      const options = { mimeType: 'audio/webm' };
      const mediaRecorder = new window.MediaRecorder(stream, options);

      mediaRecorder.addEventListener('dataavailable', (e: any) => {
        console.log('e.data: ', e.data);
        if (e.data.size > 0) {
          recordedChunks.push(e.data);
        }

        stopButtonEl.current?.addEventListener('click', () => {
          setIsRecording(false);
          mediaRecorder.stop();
        });
      });

      mediaRecorder.addEventListener('stop', () => {
        const url = 'https://brain.deepgram.com/v2/listen';
        const username = `${process.env.REACT_APP_DEEPGRAM_KEY}`;
        const password = `${process.env.REACT_APP_DEEPGRAM_KEY_SECRET}`;
        const audio = new Blob(recordedChunks);

        axios({
          method: 'post',
          url: url,
          auth: {
            username: username,
            password: password,
          },
          headers: {
            'Content-Type': 'audio/webm; codecs=opus',
          },
          params: {
            model: 'general',
          },
          data: audio,
        })
          .then((response) => {
            console.log(response.data);
            setTranscriptWords(response.data.results.channels[0].alternatives[0].transcript);
          })
          .catch((error) => {
            console.log('Error happened!: ' + error);
          });
      });

      mediaRecorder.start(1000);
    };

    navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(handleSuccess);
  };

  return (
    <div>
      {isRecording && (
        <button className="RecordingButton" ref={stopButtonEl}>
          Stop
        </button>
      )}
      {!isRecording && (
        <button className="RecordingButton" onClick={() => startHandler()}>
          Start
        </button>
      )}
      {transcriptWords && <p className="TranscriptWord">{transcriptWords}</p>}
    </div>
  );
};

export default Recite;
