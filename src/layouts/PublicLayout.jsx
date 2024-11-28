import React, { useEffect, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

import { PublicRouter } from '../routers/public.routers';
import styles from './styles/PublicLayout.module.scss';

const PublicLayout = () => {
  const AppBarWrapper = ({ Component, routerName }) => {
    useEffect(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [routerName]);

    return (
      <div className={styles.appBarWrapper}>
        <Suspense>
          <Component />
        </Suspense>
      </div>
    );
  };

  return (
    <Routes>
      {PublicRouter?.map((router, index) => (
        <Route key={`${index}-${router.name}`} path={router.path} element={<AppBarWrapper Component={router.component} routerName={router.name} />} />
      ))}
    </Routes>
  );
};

export default PublicLayout;
