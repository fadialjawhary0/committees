import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';

import AppContainer from './layouts/index';
import { ActiveLinkProvider, UserProvider, PathURLProvider, ToastProvider, SidebarProvider } from './context';

// axios.defaults.baseURL = 'http://dme-sp19dev.emea.devoteam.com:8585/api/';
// axios.defaults.baseURL = 'http://localhost:53353/api/';
axios.defaults.baseURL = 'http://localhost:51878/api/';
axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.post['Accept'] = 'application/json';

export const App = () => {
  return (
    <BrowserRouter>
      <UserProvider>
        <ToastProvider>
          <PathURLProvider>
            <SidebarProvider>
              <ActiveLinkProvider>
                <AppContainer />
              </ActiveLinkProvider>
            </SidebarProvider>
          </PathURLProvider>
        </ToastProvider>
      </UserProvider>
    </BrowserRouter>
  );
};
