import React, { useEffect, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

import { PrivateRouter } from '../routers/private.router';
import styles from './styles/PrivateLayout.module.scss';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const PrivateLayout = () => {
  const AppBarWrapper = ({ Component, routerName }) => {
    useEffect(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [routerName]);

    return (
      <div className={styles.layoutContainer}>
        <div className={styles.backgroundImage}>
          {routerName !== 'admin' && <Navbar />}
          <div className={styles.layoutContent}>
            <main className={styles.appBarWrapper} style={{ padding: routerName === 'admin' ? '0' : '' }}>
              <Suspense>
                <Component />
              </Suspense>
            </main>

            {routerName !== 'admin' && <Sidebar />}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Routes>
      {PrivateRouter?.map((router, index) => (
        <Route
          key={`${index}-${router.name}`}
          path={router.path}
          element={<AppBarWrapper Component={router.component} routerName={router.name} />}
        />
      ))}
    </Routes>
  );
};

export default PrivateLayout;
