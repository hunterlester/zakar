import React, { ReactElement, useEffect } from 'react';
import './Global.css';

const Global = (): ReactElement => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return <div>Global data visualization</div>;
};

export default Global;
