import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import AppContainer from './layouts/index';
import { ActiveLinkProvider } from './context';

function App() {
  return (
    <BrowserRouter>
      <ActiveLinkProvider>
        <AppContainer />
      </ActiveLinkProvider>
    </BrowserRouter>
  );
}

export default App;
