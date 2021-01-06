import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import AppProvider from './hooks';
import Routes from './routes';
import Navbar from './components/Navbar';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Navbar />

      <AppProvider>
        <Routes />
      </AppProvider>
    </BrowserRouter>
  );
};

export default App;
