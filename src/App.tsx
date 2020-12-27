import React, { lazy, Suspense } from 'react';
import { withRouter, Switch, Route } from 'react-router-dom';

import * as PATHS from './constants/paths';

const Home = lazy(() => import('./pages/home'));
const Settings = lazy(() => import('./pages/settings'));
const NotFound = lazy(() => import('./pages/misc/not-found'));

function App() {
  return (
    <Suspense fallback={null}>
      <Switch>
        <Route exact path={PATHS.INDEX} component={Home} />
        <Route path={PATHS.SETTINGS} component={Settings} />
        <Route path="*" component={NotFound} />
      </Switch>
    </Suspense>
  );
}

export default withRouter(App);
