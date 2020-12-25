import React, { lazy, Suspense, useEffect } from 'react';
import { withRouter, Switch, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { v4 as uuidV4 } from 'uuid';

import * as PATHS from './constants/paths';

import { appActions } from './entities/app/index';
import { settingsActions } from './entities/settings/index';

const Home = lazy(() => import('./pages/home'));
const Settings = lazy(() => import('./pages/settings'));
const NotFound = lazy(() => import('./pages/misc/not-found'));

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(appActions.willLoad());

    setTimeout(() => {
      dispatch(settingsActions.setIsRandom(true));
      dispatch(settingsActions.setTimeInterval(10000));

      // add streams
      const streams = [
        {
          id: uuidV4(),
          href: 'www.google.com',
        },
        {
          id: uuidV4(),
          href: 'www.apple.com',
        },
        {
          id: uuidV4(),
          href: 'www.thomann.de',
        },
      ];

      streams.forEach(({ id, href }) => {
        dispatch(settingsActions.addStream(id, href));
      });

      // re-order test
      const ids = streams.map(({ id }) => id);
      const firstId = ids[0];

      const newOrder = [...ids.slice(1), firstId];
      dispatch(settingsActions.setOrder(newOrder));

      dispatch(settingsActions.removeStream(ids[0]));
    }, 2500);
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
