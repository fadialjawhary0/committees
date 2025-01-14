import React, { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

const CommitteeTasks = lazy(() => import('./components/CommitteeTasks'));
const CommitteeTasksFormCreate = lazy(() => import('./components/CommitteeTaskFormCreate'));

const Router = () => {
  return (
    <Routes>
      <Route path='/' element={<CommitteeTasks />} />
      <Route path='/create' element={<CommitteeTasksFormCreate />} />
    </Routes>
  );
};

export default Router;
