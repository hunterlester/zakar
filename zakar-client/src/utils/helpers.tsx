import axios, { AxiosResponse } from 'axios';
import { ESV_PREFIX } from 'utils/const';

export const fetchVerse = (verseId: string): Promise<any> => {
  console.log('FETCH VERSE ID: ', verseId);
  return axios
    .get(`${ESV_PREFIX}/html/?q=${verseId}&include-headings=false&include-copyright=false&include-short-copyright=true&include-audio-link=false&include-passage-references=true&include-footnotes=false`, {
      headers: {
        'Authorization': `Token ${process.env.REACT_APP_ESV_API_KEY}`,
      },
    })
    .then((response: AxiosResponse) => {
        console.log(' -- -- Verse data: ', response.data);
        const verseData = response.data;
        localStorage.setItem('verse_start', verseData.parsed[0][0]);
        localStorage.setItem('verse_end', verseData.parsed[0][verseData.parsed[0].length - 1]);
        localStorage.setItem('verseID', verseData.canonical);
        localStorage.setItem('next_verse', verseData.passage_meta[0].next_verse);
        localStorage.setItem('prev_verse', verseData.passage_meta[0].prev_verse);
        console.log("LOCAL STORAGE: ", localStorage);
        return verseData;
    })
    .catch((error) => {
      console.error(error);
      throw error;
    });
};
