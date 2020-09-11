import { useEffect, useContext } from 'react';
import { fetchVerse } from 'utils/helpers';
import { useHistory } from 'react-router-dom';
import { StateContext } from 'StateProvider';

export default (): void => {
  const { setVerseString, verseString, setVerseText, verseIDArray, setVerseArray, setStandardFetchState } = useContext(
    StateContext,
  );
  const history = useHistory();

  const gatherText = () => {
    let text = '';
    const textNodes = document.querySelectorAll('.VerseContainer p');
    textNodes.forEach((node) => {
      text += ` ${node.textContent}`;
    });
    if (text) {
      setVerseText(text.trim());
    }
  };

  useEffect(() => {
    if (!!verseString) {
      console.log('VERSE ALREADY STORED, SO RETURNING');
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

          setStandardFetchState(verseData);
          setVerseString(verseData.passages[0]);
          setVerseArray(JSON.parse(`${[verseData.parsed[0][0]]}`));
        })
        .catch((error) => {
          if (error.response && /login_cta/.test(error.response.headers.location)) {
            return history.push('/login-cta');
          }
          console.error(error);
        });
    }
  }, []);

  useEffect(() => {
    gatherText();
  }, [verseString]);
};
