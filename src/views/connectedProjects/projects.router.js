import React, { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

const RelatedProjects = lazy(() => import('./components/RelatedProjects'));
const ProjectDetails = lazy(() => import('./components/ProjectDetails'));

const Router = () => {
  return (
    <Routes>
      <Route path='/' element={<RelatedProjects />} />
      <Route path='/:projectId' element={<ProjectDetails />} />
    </Routes>
  );
};

export default Router;
