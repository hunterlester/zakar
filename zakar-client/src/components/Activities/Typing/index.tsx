import React, { ReactElement } from 'react';
import './Typing.css';
import { ActivityProps } from 'react-app-env';
import Verse from 'components/Verse';

const Typing = (props: ActivityProps): ReactElement => {
  const { verseString } = props;
  return (
    <div>
      TYPING
      <Verse verseString={verseString} />
    </div>
  );
};

export default Typing;
