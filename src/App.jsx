import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';

import AppContainer from './layouts/index';
import { ActiveLinkProvider, UserProvider } from './context';

axios.defaults.baseURL = 'http://dme-sp19dev.emea.devoteam.com:8585/api/';
axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.post['Accept'] = 'application/json';

export const App = () => {
  return (
    <BrowserRouter>
      <UserProvider>
        <ActiveLinkProvider>
          <AppContainer />
        </ActiveLinkProvider>
      </UserProvider>
    </BrowserRouter>
  );
};
