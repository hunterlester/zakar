import React, { ReactElement, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './Terms.css';

const Terms = (): ReactElement => {
  const location = useLocation();
  useEffect(() => {
    if (location.hash === '#beta') {
      window.scrollTo(0, document.body.scrollHeight);
    } else {
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <div className="TermsContainer">
      <h2>Terms</h2>

      <ul>
        <li>
          You will <span className="TextHighlight">not</span> be served advertisements.
        </li>
        <li>Your data, or metadata, will not be collected and/or sold for any monetary purpose.</li>
        <li>
          <p>
            If you choose to login, the only piece of personal information which will be collected is your email
            address, to be used to identify your account.
          </p>
          <p>
            However, your email address will not be stored in plain text format, but rather in a cryptographically
            hashed format.
          </p>
          <p>Here&apos;s what a user entry will look like in database:</p>

          <div className="table">
            <table>
              <thead>
                <tr>
                  <th>id</th>
                  <th>user_id</th>
                  <th>verses</th>
                  <th>created_at</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>f536612b53ad4196ddb73aa8d53a176bd2a506f7363961523eed5f3a5afd271a</td>
                  <td>[18001022]</td>
                  <td>2020-09-17 03:56:43.57373</td>
                </tr>
              </tbody>
            </table>
          </div>
        </li>
        <li>Given previous point, your email address will never be used to send you mail.</li>
        <li>Your IP address will not be stored, or processed to determine your location.</li>

        <h3>Beta Version</h3>
        <h4 id="beta">This app is still in beta testing, so expect that:</h4>
        <ul>
          <li>Database may be wiped at any time</li>
          <li>New features may be added</li>
          <li>Current features may be removed</li>
          <li>Bugs and unexpected errors are still being found and addressed</li>
        </ul>
      </ul>
    </div>
  );
};

export default Terms;
