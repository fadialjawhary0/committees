import React, { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

const Inbox = lazy(() => import('./components/Inbox'));

const Router = () => {
  return (
    <Routes>
      <Route path='/' element={<Inbox />} />
    </Routes>
  );
};

export default Router;
