import axios, { AxiosResponse, AxiosError } from 'axios';
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
  const verseFormat = args.format ? args.format : RequestFormat.HTML;
  const requestHref = IS_NODE_DEV ? ESV_PREFIX : `${SERVER_ORIGIN}/proxy`;
  const headers = {
    Authorization: IS_NODE_DEV ? `Token ${process.env.REACT_APP_ESV_API_KEY}` : `Bearer ${getCookie('bearer')}`,
  };
  return axios
    .get(`${requestHref}/${verseFormat}/?q=${args.verseCanonical}`, {
      params: { ...defaultParams, ...args.params },
      headers,
    })
    .then((response: AxiosResponse) => {
      return response.data;
    })
    .catch((error: AxiosError) => {
      console.error(error);
      throw error;
    });
};

export const updateUserVerses = (userID: string, data: string): Promise<AxiosResponse<number>> => {
  const headers = {
    Authorization: `Bearer ${getCookie('bearer')}`,
    'Content-Type': 'application/json',
  };
  return axios
    .put(`/users/${userID}/verses`, data, {
      headers,
    })
    .then((response: AxiosResponse) => {
      return response;
    })
    .catch((error: AxiosError) => {
      console.error(error);
      throw error;
    });
};

export const getUserVerses = (userID: string): Promise<AxiosResponse<string[]>> => {
  const headers = {
    Authorization: `Bearer ${getCookie('bearer')}`,
    'Content-Type': 'application/json',
  };
  return axios
    .get(`/users/${userID}/verses`, {
      headers,
    })
    .then((response: AxiosResponse) => {
      return response;
    })
    .catch((error: AxiosError) => {
      console.error(error);
      throw error;
    });
};
