import React, { useContext, useEffect } from 'react';
import { ActiveLinkContext, UserContext } from '../context';

import { useNavigate } from 'react-router-dom';
import PrivateLayout from './PrivateLayout';
import PublicLayout from './PublicLayout';

const Layout = () => {
  const navigate = useNavigate();

  const { setActiveLink } = useContext(ActiveLinkContext);
  const { user, setUser } = useContext(UserContext);

  const location = window.location.pathname;

  useEffect(() => {
    const routeToIdMap = {
      '/overview': '1',
      '/inbox': '2',
      '/users': '3',
      '/team-tasks': '4',
      '/meetings': '5',
      '/tasks': '6',
      '/ativity-log': '7',
      '/related-projects': '8',
      '/related-documents': '9',
      '/news': '10',
    };

    for (const [path, id] of Object.entries(routeToIdMap)) {
      if (location.startsWith(path)) {
        setActiveLink(parseInt(id));
        break;
      }
    }
  }, [location, setActiveLink]);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (isLoggedIn) {
      setUser(true);
    } else {
      setUser(false);
      navigate('/login');
    }

    if (location.pathname === '/') {
      navigate('/overview');
    }
  }, [user, navigate, location.pathname, setUser]);

  return user === true ? <PrivateLayout /> : <PublicLayout />;
};

export default Layout;
