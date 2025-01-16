import React, { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

const AdminHomepage = lazy(() => import('./components/AdminHomepage'));
const Users = lazy(() => import('./components/Users'));

const Router = () => {
  return (
    <Routes>
      <Route path='/' element={<AdminHomepage />} />
      <Route path='/locations' element={<AdminHomepage />} />
      <Route path='/buildings' element={<AdminHomepage />} />
      <Route path='/rooms' element={<AdminHomepage />} />
      <Route path='/users' element={<AdminHomepage />} />
      <Route path='/roles' element={<AdminHomepage />} />
      <Route path='/permissions' element={<AdminHomepage />} />
      <Route path='/committee-categories' element={<AdminHomepage />} />
      <Route path='/committee-departments' element={<AdminHomepage />} />
      <Route path='/meeting-types' element={<AdminHomepage />} />
      <Route path='/role-permissions' element={<AdminHomepage />} />
      <Route path='/meeting-statuses' element={<AdminHomepage />} />
      <Route path='/committee-task-statuses' element={<AdminHomepage />} />
      <Route path='/meeting-task-statuses' element={<AdminHomepage />} />
    </Routes>
  );
};

export default Router;
