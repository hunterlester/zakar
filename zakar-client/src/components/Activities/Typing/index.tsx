import React, { ReactElement } from 'react';
import './Typing.css';
import { ActivityProps } from 'react-app-env';
import Verse from 'components/Verse';

const Typing = (props: ActivityProps): ReactElement => {
  const { verseString } = props;
  return (
    <div>
      <Verse verseString={verseString} />
      <textarea autoFocus={true} className="TypingInput" />
    </div>
  );
};

export default Typing;
