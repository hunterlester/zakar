import React, { ReactElement } from 'react';
import './Type.css';
import { ActivityProps } from 'react-app-env';
import Verse from 'components/Verse';

const Type = (props: ActivityProps): ReactElement => {
  const { verseString } = props;
  return (
    <div>
      <Verse verseString={verseString} />
      <textarea autoFocus={true} className="TypingInput" />
    </div>
  );
};

export default Type;
