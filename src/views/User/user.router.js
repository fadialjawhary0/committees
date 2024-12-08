import React, { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

const Login = lazy(() => import('./components/Login'));

const Router = () => {
  return (
    <Routes>
      <Route path='/' element={<Login />} />
    </Routes>
  );
};

export default Router;
