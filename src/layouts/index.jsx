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
      '/inbox': '2',
      '/users': '3',
      '/committee-tasks': '4',
      '/meetings': '5',
      '/tasks': '6',
      '/activity-log': '7',
      '/related-projects': '8',
      '/related-documents': '9',
      '/news': '10',
      '/admin/locations': 1,
      '/admin/buildings': 2,
      '/admin/rooms': 3,
      '/admin/users': 4,
      '/admin/roles': 5,
      '/admin/permissions': 6,
      '/admin/role-permissions': 7,
      '/admin/committee-categories': 8,
      '/admin/committee-file-types': 9,
      '/admin/committee-departments': 10,
      '/admin/committee-task-statuses': 11,
      '/admin/meeting-types': 12,
      '/admin/meeting-statuses': 13,
      '/admin/meeting-task-statuses': 14,
    };

    for (const [path, id] of Object.entries(routeToIdMap)) {
      if (location.startsWith(path)) {
        setActiveLink(parseInt(id));
        break;
      } else {
        setActiveLink(1);
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
  }, [user, navigate, location.pathname, setUser]);

  return user === true ? <PrivateLayout /> : <PublicLayout />;
};

export default Layout;
