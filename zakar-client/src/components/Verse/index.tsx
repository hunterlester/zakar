import React, { ReactElement } from 'react';
import './Verse.css';

interface Props {
  verses: any[];
}

const Verse = (props: Props): ReactElement => {
  const { verses } = props;

  return (
    <>
      <div className="VerseContainer">
        {verses.map((verse) => {
          return <div key={verse.id} dangerouslySetInnerHTML={{ __html: verse.content }} />;
        })}
      </div>
      {!!verses.length && <div className="VerseCopyright">{verses[0].copyright}</div>}
    </>
  );
};

export default Verse;
