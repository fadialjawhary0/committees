import React, { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

const Meetings = lazy(() => import('./components/Meetings'));
const CreateMeeting = lazy(() => import('./components/CreateMeeting'));
const EditMeeting = lazy(() => import('./components/EditMeeting'));
const MeetingDetails = lazy(() => import('./components/MeetingDetails'));

const Router = () => {
  return (
    <Routes>
      <Route path='/' element={<Meetings />} />
      <Route path='/:id' element={<MeetingDetails />} />
      <Route path='/create' element={<CreateMeeting />} />
      <Route path='/edit/:id' element={<EditMeeting />} />
    </Routes>
  );
};

export default Router;
