import React, { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

const AdminHomepage = lazy(() => import('./components/AdminHomepage'));
const Users = lazy(() => import('./components/Users'));

const Router = () => {
  return (
    <Routes>
      <Route path='/' element={<AdminHomepage />} />
      <Route path='users' element={<Users />} />
    </Routes>
  );
};

export default Router;
