export const PREFIX = 'https://api.scripture.api.bible/v1';
export const ESV_PREFIX = 'https://api.esv.org/v3/passage';

export const BIBLE_ID = 'de4e12af7f28f599-02'; // KJV minus apocrypha

export enum Activities {
  Builder,
  FocusedScroll,
  DoodlePad,
  Recite,
  Typing,
  Listening,
}

export const ESV_COPYRIGHT = `Scripture quotations are from the ESV® Bible
(The Holy Bible, English Standard Version®), copyright © 2001 by Crossway,
a publishing ministry of Good News Publishers. Used by permission. All rights reserved.
You may not copy or download more than 500 consecutive verses of the ESV Bible or more
than one half of any book of the ESV Bible.`;

export enum RequestFormat {
  TEXT = 'text',
  HTML = 'html',
  AUDIO = 'audio',
  SEARCH = 'search',
}
