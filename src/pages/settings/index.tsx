import React, { FunctionComponent } from 'react';
import {
  Switch,
  Route,
  RouteComponentProps,
  useRouteMatch,
} from 'react-router-dom';

import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { createStyles, makeStyles } from '@material-ui/core';

import SettingsForm from '../../ui/forms/settings';

interface SettingsProps extends RouteComponentProps {} // eslint-disable-line

const useStyles = makeStyles(() =>
  createStyles({
    title: {
      marginTop: '1rem',
    },
  })
);

const SettingsPage: FunctionComponent<SettingsProps> = () => {
  const classes = useStyles();
  return (
    <Container maxWidth="sm">
      <Typography className={classes.title} variant="h1" gutterBottom>
        Settings
      </Typography>
      <SettingsForm />
    </Container>
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
