import { useEffect } from 'react';

const Logout = (props) => {

  useEffect(() => {
    localStorage.removeItem('token');
    props.onLogout();
  }, []);

  return null;
};

export default Logout;
