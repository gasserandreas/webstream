import React from 'react';
import { Switch, Route, RouteComponentProps, useRouteMatch } from 'react-router-dom';

interface SettingsProps extends RouteComponentProps {}

export function SettingsPage(props: SettingsProps) {
  return (
    <div>
      <strong>Settings Page</strong>
    </div>
  );
}

export default function IndexHandler() {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route path={path} component={SettingsPage} />
    </Switch>
  );
}