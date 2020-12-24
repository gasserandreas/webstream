import React, { lazy, Suspense, useEffect } from 'react';
import { withRouter, Switch, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import * as PATHS from './constants/paths';

import { appActions } from './entities/app/index';

const Home = lazy(() => import('./pages/home'));
const Settings = lazy(() => import('./pages/settings'));
const NotFound = lazy(() => import('./pages/misc/not-found'));

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(appActions.willLoad());
  }, [dispatch]);

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
