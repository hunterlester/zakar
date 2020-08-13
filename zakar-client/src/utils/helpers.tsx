import axios, { AxiosResponse } from 'axios';
import { ESV_PREFIX, RequestFormat } from 'utils/const';

interface Args {
  verseID: string;
  format: RequestFormat;
  params?: {
    'include-headings'?: boolean;
    'include-copyright'?: boolean;
    'include-short-copyright'?: boolean;
    'include-audio-link'?: boolean;
    'include-passage-references'?: boolean;
    'include-footnotes'?: boolean;
  };
}

interface PassageResponse {
  passages: string[];
}

export const fetchVerse = (args: Args): Promise<PassageResponse> => {
  console.log('FETCH VERSE ID: ', args.verseID);
  return axios
    .get(`${ESV_PREFIX}/${args.format}/?q=${args.verseID}`, {
      params: args.params,
      headers: {
        Authorization: `Token ${process.env.REACT_APP_ESV_API_KEY}`,
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
      console.log('LOCAL STORAGE: ', localStorage);
      return verseData;
    })
    .catch((error) => {
      console.error(error);
      throw error;
    });
};
