import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import Routes from './routes';
import Navbar from './components/Navbar';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes />
    </BrowserRouter>
  );
};

export default App;
