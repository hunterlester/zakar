import React, { ReactElement, useEffect } from 'react';
import './Login.css';

const Login = (): ReactElement => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return <div>Login page</div>;
};

export default Login;
