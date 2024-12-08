import React, { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

const RelatedDocuments = lazy(() => import('./components/RelatedDocuments'));

const Router = () => {
  return (
    <Routes>
      <Route path='/' element={<RelatedDocuments />} />
    </Routes>
  );
};

export default Router;
