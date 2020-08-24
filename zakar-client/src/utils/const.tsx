export const ESV_PREFIX = 'https://api.esv.org/v3/passage';
export const SERVER_ORIGIN = window.location.origin;
export const IS_NODE_DEV = process.env.NODE_ENV === "development";

export const BIBLE_ID = 'de4e12af7f28f599-02'; // KJV minus apocrypha

export enum Activities {
  Build,
  Read,
  Type,
  Listen,
  Recite,
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

export const defaultParams = {
  'include-headings': false,
  'include-copyright': false,
  'include-short-copyright': false,
  'include-audio-link': false,
  'include-passage-references': true,
  'include-footnotes': false,
};

export const PSALM_119_10_11 =
  '<h2 class="extra_text">Psalm 119:10–11</h2><p class="block-indent"><span class="begin-line-group"></span><span id="p19119010_01-1" class="line"><b class="verse-num inline" id="v19119010-1">10&nbsp;</b>&nbsp;&nbsp;With my whole heart I seek you;</span><br /><span id="p19119010_01-1" class="indent line">&nbsp;&nbsp;&nbsp;&nbsp;let me not wander from your commandments!</span><br /><span id="p19119011_01-1" class="line"><b class="verse-num inline" id="v19119011-1">11&nbsp;</b>&nbsp;&nbsp;I have stored up your word in my heart,</span><br /><span id="p19119011_01-1" class="indent line">&nbsp;&nbsp;&nbsp;&nbsp;that I might not sin against you.</span><br /></p><span class="end-line-group"></span>';

export const ActivityInstructions = {
  [Activities.Build]:
    "<h4>Build the verse that you'd like to memorize</h4><ul><li>Add or remove preceding verse.</li><li>Add or remove next verse.</li></ul>",
  [Activities.Read]:
    '<h4>Focused reading</h4><ul><li>Use your right keyboard arrow key or the "Tap me" button to highlight each word.</li><li>Tap rhythmically while reading out loud.</li></ul>',
  [Activities.Type]:
    "<h4>Practice typing your verse</h4><ul><li>Include verse numbers and punctuation.</li><li>If box for this activity does not turn green when you're done typing, look closely at what you typed, in comparison to your verse; it's part of the exercise. &#x1F609;</li></ul>",
  [Activities.Listen]:
    '<h4>Listen to your verse</h4><ul><li>Close your eyes and listen closely.</li><li>Use the doodling pad below if this is something that helps you focus on what you hear.</li></ul>',
  [Activities.Recite]:
    '<h4>Recite your verse out loud</h4><ul><li>Speak clearly into your microphone.</li><li>Take your time and breathe as you speak, as there is no need to quickly recite.</li></ul>',
};
