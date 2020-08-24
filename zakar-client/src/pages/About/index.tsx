import React, { ReactElement, useEffect } from 'react';
import './About.css';
import { PSALM_119_10_11 } from 'utils/const';

const About = (): ReactElement => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="AboutContainer">
      <h2>
        זָכַר zâkar, zaw-kar&apos;
        <sup className="SupLink">
          (
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.blueletterbible.org/lang/lexicon/lexicon.cfm?t=kjv&amp;strongs=h2142"
          >
            ref
          </a>
          )
        </sup>
      </h2>

      <p>
        May this application be an effective tool for scriptural memorization, never forgetting the purpose of which is
        to develop our relationship with Jesus Christ.
      </p>
      <p>May the Holy Spirit guide its development.</p>
      <p>Amen.</p>
      <br />

      <div dangerouslySetInnerHTML={{ __html: PSALM_119_10_11 }} />
      <br />

      <h4>Terms:</h4>
      <ul>
        <li>
          You will <span className="TextHighlight">not</span> be served advertisements.
        </li>
        <li>
          Your personal data, limited to email and/or phone number, may potentially be requested to help you sign-in or
          to recover a lost account. If collected, this data will be stored in an encrypted format.
        </li>
        <li>Your data, or metadata, will not be collected and/or sold for any monetary purpose.</li>
        <li>
          Although you have the option of creating an account, it&apos;s only purpose is for storing your scriptural
          memorization progress and is <span className="TextHighlight">not</span> necessary for utilizing the
          memorization activities.
        </li>
      </ul>

      <h4>Reporting bugs and feature requests:</h4>
      <p>
        Please file any issues or requests{' '}
        <a target="_blank" rel="noopener noreferrer" href="https://github.com/hunterlester/zakar/issues/new/choose">
          here
        </a>
        , with the knowledge that development happens in spare time and by one developer.
      </p>
    </div>
  );
};

export default About;
