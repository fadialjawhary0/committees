import React, { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

const UserTasks = lazy(() => import('./components/UserTasks'));

const Router = () => {
  return (
    <Routes>
      <Route path='/' element={<UserTasks />} />
    </Routes>
  );
};

export default Router;
