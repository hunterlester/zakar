import React, { ReactElement } from 'react';
import './Verse.css';
import { ActivityProps } from 'react-app-env';

const Verse = (props: ActivityProps): ReactElement => {
  const { verseString } = props;

  return (
    <>
      <div className="VerseContainer">{verseString && <div dangerouslySetInnerHTML={{ __html: verseString }} />}</div>
    </>
  );
};

export default Verse;
