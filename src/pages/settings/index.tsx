import React, { FunctionComponent, useMemo } from 'react';
import {
  Switch,
  Route,
  RouteComponentProps,
  useRouteMatch,
} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { createStyles, makeStyles } from '@material-ui/core';

import SettingsForm, { FormData } from '../../ui/forms/settings';

// import { Link, LinkList } from '../../entities/models';
import { settingsActions } from '../../entities/settings';
import {
  settingsIntervalSelector,
  settingsStreamsOrderedListSelector,
  settingsIsRandomOrderSelector,
} from '../../entities/settings/selectors';

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

  const dispatch = useDispatch();
  const interval = useSelector(settingsIntervalSelector);
  const isRandom = useSelector(settingsIsRandomOrderSelector);
  const links = useSelector(settingsStreamsOrderedListSelector);

  const formData: FormData = useMemo(
    () => ({
      interval: `${interval / 60000}`,
      random: isRandom,
      links,
    }),
    [interval, isRandom, links]
  );

  const handleSave = (values: FormData) => {
    const newValues = {
      ...values,
      interval: parseFloat(values.interval) * 60000,
    };
    // eslint-disable-next-line no-console
    console.log({ newValues });
    dispatch(
      settingsActions.setSettings(
        newValues.interval,
        newValues.random,
        newValues.links
      )
    );
  };

  return (
    <Container maxWidth="sm">
      <Typography className={classes.title} variant="h1" gutterBottom>
        Settings
      </Typography>
      <SettingsForm data={formData} onSave={handleSave} />
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
