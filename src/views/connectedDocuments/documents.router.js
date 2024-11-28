import React, { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

const Documents = lazy(() => import('./components/Documents'));

const Router = () => {
  return (
    <Routes>
      <Route path='/' element={<Documents />} />
    </Routes>
  );
};

export default Router;
