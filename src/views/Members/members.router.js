import React, { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

const Users = lazy(() => import('./components/Users'));
const AddUser = lazy(() => import('./components/AddUser'));
const EditUser = lazy(() => import('./components/EditUser'));

const Router = () => {
  return (
    <Routes>
      <Route path='/' element={<Users />} />
      <Route path='/add-user' element={<AddUser />} />
      <Route path='/edit-user/:id' element={<EditUser />} />
    </Routes>
  );
};

export default Router;
