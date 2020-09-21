import React, { ReactElement, useEffect } from 'react';
import './About.css';
import { PSALM_119_10_11 } from 'utils/const';
import { useLocation } from 'react-router-dom';

const About = (): ReactElement => {
  const location = useLocation();
  useEffect(() => {
    if (location.hash === '#beta') {
      window.scrollTo(0, document.body.scrollHeight);
    } else {
      window.scrollTo(0, 0);
    }
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
        <li>Your data, or metadata, will not be collected and/or sold for any monetary purpose.</li>
        <li>
          If you choose to login, the only piece of personal information which will be collected is your email address,
          to be used to identify your account, for the purpose of storing verse memorization progress. However, your
          email address will not be stored in plain text format, but rather in a cryptographically hashed format.
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

      <h2>Beta Version</h2>
      <h4 id="beta">This app is still in beta testing, so expect that:</h4>
      <ul>
        <li>Database may be wiped at any time</li>
        <li>New features may be added</li>
        <li>Current features may be removed</li>
        <li>Bugs and unexpected errors are still being found and addressed</li>
      </ul>
    </div>
  );
};

export default About;
