import React, { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

const Committees = lazy(() => import('./components/Committees'));
const CommitteeFormCreate = lazy(() => import('./components/CommitteeFormCreate'));
const CommitteeFormEdit = lazy(() => import('./components/CommitteeFormEdit'));
const CommitteeDetails = lazy(() => import('./components/CommitteeDetails'));
const DiscussionsDetails = lazy(() => import('./components/DiscussionsDetails'));

const Router = () => {
  return (
    <Routes>
      <Route path='/' element={<Committees />} />
      <Route path='/committee/create' element={<CommitteeFormCreate />} />
      <Route path='/committee/edit/:id' element={<CommitteeFormEdit />} />
      <Route path='/committee/:id' element={<CommitteeDetails />} />
      <Route path='/committee/:committeeName/discussions' element={<DiscussionsDetails />} />
    </Routes>
  );
};

export default Router;
