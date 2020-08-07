import React, { ReactElement } from 'react';
import './Typing.css';
import { ActivityProps } from 'react-app-env';
import Verse from 'components/Verse';

const Typing = (props: ActivityProps): ReactElement => {
  const { verses } = props;
  return (
    <div>
      TYPING
      <Verse verses={verses} />
    </div>
  );
};

export default Typing;
