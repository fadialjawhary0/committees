import React, { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

const Agreements = lazy(() => import('./components/Agreements'));

const Router = () => {
  return (
    <Routes>
      <Route path='/' element={<Agreements />} />
    </Routes>
  );
};

export default Router;
