import React, { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

const Overview = lazy(() => import('./components/Overview'));
const AddCommittee = lazy(() => import('./components/AddCommittee'));
const CommitteeDetails = lazy(() => import('./components/CommitteeDetails'));
const Discussions = lazy(() => import('./components/Discussions'));

const Router = () => {
  return (
    <Routes>
      <Route path='/' element={<Overview />} />
      <Route path='/add-committee' element={<AddCommittee />} />
      <Route path='/committee/:id' element={<CommitteeDetails />} />
      <Route path='/committee/:committeeName/discussions' element={<Discussions />} />
    </Routes>
  );
};

export default Router;
