import React, { ReactElement, useState, useEffect } from 'react';
import { PREFIX, BIBLE_ID } from 'utils/const';
import { useParams } from 'react-router-dom';
import './Verse.css';

const Verse = (): ReactElement => {
  const { verseId } = useParams();
  const [verseData, setVerseData] = useState<any>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    setError('');
    fetch(`${PREFIX}/bibles/${BIBLE_ID}/verses/${verseId}`, {
      headers: {
        'api-key': `${process.env.REACT_APP_BIBLE_API_KEY}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setError(data.message);
        } else {
          const _BAPI = window._BAPI || {};
          if (typeof _BAPI.t != undefined) {
            console.log('-- Calling BAPI.t with fums ID: ', data.meta.fumsId);
            _BAPI.t(data.meta.fumsId);
          }
          console.log('Verse data: ', data);
          setVerseData(data.data);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <>
      <div className="VerseContainer" dangerouslySetInnerHTML={{ __html: verseData.content }} />
      <div className="VerseCopyright">{verseData.copyright}</div>
    </>
  );
};

export default Verse;
