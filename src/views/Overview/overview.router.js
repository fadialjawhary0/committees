import React, { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

const Overview = lazy(() => import('./components/Overview'));
const CommitteeFormCreate = lazy(() => import('./components/CommitteeFormCreate'));
const CommitteeFormEdit = lazy(() => import('./components/CommitteeFormEdit'));
const CommitteeDetails = lazy(() => import('./components/CommitteeDetails'));
const DiscussionsDetails = lazy(() => import('./components/DiscussionsDetails'));

const Router = () => {
  return (
    <Routes>
      <Route path='/' element={<Overview />} />
      <Route path='/create' element={<CommitteeFormCreate />} />
      <Route path='/committee/edit/:id' element={<CommitteeFormEdit />} />
      <Route path='/committee/:id' element={<CommitteeDetails />} />
      <Route path='/committee/:committeeName/discussions' element={<DiscussionsDetails />} />
    </Routes>
  );
};

export default Router;
