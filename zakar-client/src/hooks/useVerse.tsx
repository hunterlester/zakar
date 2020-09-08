import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { fetchVerse } from 'utils/helpers';
import { useHistory } from 'react-router-dom';

export default (state: string): [string, Dispatch<SetStateAction<string>>] => {
  const [verse, setVerse] = useState<string>(state);
  const history = useHistory();

  const gatherText = () => {
    let text = '';
    const textNodes = document.querySelectorAll('.VerseContainer p');
    textNodes.forEach((node) => {
      text += ` ${node.textContent}`;
    });
    if (text) {
      localStorage.setItem('verseText', text.trim());
    }
  };

  useEffect(() => {
    const verseIDArray = JSON.parse(`${localStorage.getItem('verseIDArray')}`);
    const verseString = localStorage.getItem('verseString');

    if (!!verseString) {
      console.log('VERSE ALREADY STORED, SO RETURNING');
      setVerse(verseString);
      return;
    }

    if (verseIDArray && verseIDArray.length) {
      const fetchArgs = {
        verseCanonical:
          verseIDArray.length > 1 ? `${verseIDArray[0]}-${verseIDArray[verseIDArray.length - 1]}` : verseIDArray[0],
      };

      fetchVerse(fetchArgs)
        .then((verseData) => {
          console.log('NETWORK REQUEST FOR VERSE MADE');
          // console.log('Map verse data: ', verseData);

          localStorage.setItem('verseString', verseData.passages[0]);
          localStorage.setItem('verseIDArray', JSON.parse(`${[verseData.parsed[0][0]]}`));
          setVerse(verseData.passages[0]);
        })
        .catch((error) => {
          if (error.response && /login_cta/.test(error.response.headers.location)) {
            return history.push("/login-cta");
          }
          console.error(error);
        });
    }
  }, []);

  useEffect(() => {
    gatherText();
  }, [verse]);

  return [verse, setVerse];
};
