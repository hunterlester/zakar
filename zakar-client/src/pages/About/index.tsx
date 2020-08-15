import React, { ReactElement } from 'react';
import './About.css';

const About = (): ReactElement => {
  return (
    <div className="AboutContainer">
      <h2>Warm welcome</h2>

      <p>
        Inspired by an apologetics course, taken one summer with my father, I pray that this application is a tool for
        growing our relationship with God.
      </p>
      <p>May the Holy Spirit guide its development, the Lord willing.</p>
      <br />

      <h4>Terms of service:</h4>
      <ul>
        <li>
          You will <span className="TextHighlight">not</span> be served advertisements.
        </li>
        <li>
          Your personal data, limited to email and/or phone number, may potentially be requested to help you sign-in or
          to recover a lost account. If collected, this data will be stored in a strongly hashed and encrypted format,
          in the case of a database breach.
        </li>
        <li>Your data, or metadata, will not be collected and/or sold for any monetary purpose.</li>
        <li>
          As such, although you have the option of creating an account, it&apos;s only purpose is for storing your
          scriptural memorization progress and is <span className="TextHighlight">not</span> necessary for using the
          memorization activities.
        </li>
      </ul>

      <h4>Support:</h4>
      <p>
        Please file any issues{' '}
        <a target="_blank" rel="noreferrer" href="https://github.com/hunterlester/zakar/issues">
          here
        </a>
        .
      </p>
    </div>
  );
};

export default About;
