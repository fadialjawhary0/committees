import React, { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

const Tasks = lazy(() => import('./components/Tasks'));

const Router = () => {
  return (
    <Routes>
      <Route path='/' element={<Tasks />} />
    </Routes>
  );
};

export default Router;
