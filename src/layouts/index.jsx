import React, { useContext, useEffect } from 'react';
import PublicLayout from './PublicLayout';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { ActiveLinkContext } from '../context';

import styles from './styles/Index.module.scss';

const Layout = () => {
  const { setActiveLink } = useContext(ActiveLinkContext);

  const location = window.location;

  useEffect(() => {
    const routeToIdMap = {
      '/overview': '1',
      '/inbox': '2',
      '/users': '3',
      '/team-tasks': '4',
      '/meetings': '5',
      '/requests': '6',
      '/ativity-log': '7',
      '/related-projects': '8',
      '/related-documents': '9',
      '/news': '10',
    };

    for (const [path, id] of Object.entries(routeToIdMap)) {
      if (location.pathname.startsWith(path)) {
        setActiveLink(parseInt(id));
        break;
      }
    }
  }, [location, setActiveLink]);

  return (
    <div className={styles.layoutContainer}>
      <Navbar />
      <div className={styles.layoutContent}>
        <PublicLayout />
        <Sidebar />
      </div>
    </div>
  );
};

export default Layout;
