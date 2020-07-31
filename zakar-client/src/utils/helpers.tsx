import axios, { AxiosResponse } from 'axios';
import { PREFIX, BIBLE_ID } from 'utils/const';

export const fetchVerse = (verseId: string): Promise<any> => {
  return axios
    .get(`${PREFIX}/bibles/${BIBLE_ID}/verses/${verseId}`, {
      headers: {
        'api-key': `${process.env.REACT_APP_BIBLE_API_KEY}`,
      },
    })
    .then((data: AxiosResponse) => {
      if (data.data.error) {
        throw data.data.message;
      } else {
        const _BAPI = window._BAPI || {};
        if (typeof _BAPI.t != undefined) {
          console.log('-- Calling BAPI.t with fums ID: ', data.data.meta.fumsId);
          _BAPI.t(data.data.meta.fumsId);
        }
        console.log(' -- -- Verse data: ', data.data);
        return data.data.data;
      }
    })
    .catch((error) => {
      console.error(error);
      throw error;
    });
};
