import React, { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

const ActivityLog = lazy(() => import('./components/ActivityLog'));

const Router = () => {
  return (
    <Routes>
      <Route path='/' element={<ActivityLog />} />
    </Routes>
  );
};

export default Router;
