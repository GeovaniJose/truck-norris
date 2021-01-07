import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Dashboard from '../pages/Dashboard';
import Random from '../pages/Random';
import Favorites from '../pages/Favorites';

const Routes: React.FC = () => (
  <Switch>
    <Route path="/" exact component={Dashboard} />
    <Route path="/random" component={Random} />
    <Route path="/favorites" component={Favorites} />
  </Switch>
);

export default Routes;
