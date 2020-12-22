import React, { FunctionComponent } from "react";
import {
  Switch,
  Route,
  RouteComponentProps,
  useRouteMatch,
} from "react-router-dom";

interface SettingsProps extends RouteComponentProps {} // eslint-disable-line

const SettingsPage: FunctionComponent<SettingsProps> = () => {
  return (
    <div>
      <strong>Settings Page</strong>
    </div>
  );
};

const IndexHandler: FunctionComponent<RouteComponentProps> = () => {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route path={path} component={SettingsPage} />
    </Switch>
  );
};

export default IndexHandler;
