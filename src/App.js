import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import AppContainer from './layouts/index';
import { ActiveLinkProvider, UserProvider } from './context';

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <ActiveLinkProvider>
          <AppContainer />
        </ActiveLinkProvider>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
