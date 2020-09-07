import axios, { AxiosResponse } from 'axios';
import { SERVER_ORIGIN, RequestFormat, defaultParams, ESV_PREFIX, IS_NODE_DEV } from 'utils/const';

interface Args {
  verseCanonical: string;
  format?: RequestFormat;
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
  parsed: number[][];
}

export const getCookie = (name: string): string | null => {
  const cookies = Array.from(document.cookie.split(';'));
  const cookie = cookies.find((cookie) => new RegExp(`^(${name})`).test(cookie.trim()));
  if (cookie) {
    const cookieValue = cookie.split('=')[1];
    return cookieValue;
  } else {
    return null;
  }
};

export const fetchVerse = (args: Args): Promise<PassageResponse> => {
  // console.log('FETCH VERSE ID: ', args.verseCanonical);
  const verseFormat = args.format ? args.format : RequestFormat.HTML;
  const requestHref = IS_NODE_DEV ? ESV_PREFIX : `${SERVER_ORIGIN}/proxy`;
  const headers = {
    Authorization: IS_NODE_DEV ? `Token ${process.env.REACT_APP_ESV_API_KEY}` : `Bearer ${getCookie('bearer')}`,
  };
  debugger;
  return axios
    .get(`${requestHref}/${verseFormat}/?q=${args.verseCanonical}`, {
      params: { ...defaultParams, ...args.params },
      headers,
    })
    .then((response: AxiosResponse) => {
      // console.log(' -- -- Verse data: ', response.data);
      const verseData = response.data;
      localStorage.setItem('verseCanonical', verseData.canonical);
      localStorage.setItem('next_verse', verseData.passage_meta[0].next_verse);
      localStorage.setItem('prev_verse', verseData.passage_meta[0].prev_verse);
      // console.log('LOCAL STORAGE: ', localStorage);
      return verseData;
    })
    .catch((error) => {
      console.error(error);
      throw error;
    });
};
