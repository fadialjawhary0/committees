import React, { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

const News = lazy(() => import('./components/News'));
const CreateNews = lazy(() => import('./components/CreateNew'));

const Router = () => {
  return (
    <Routes>
      <Route path='/' element={<News />} />
      <Route path='/create-new' element={<CreateNews />} />
    </Routes>
  );
};

export default Router;
