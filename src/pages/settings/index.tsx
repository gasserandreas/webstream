import React, { FunctionComponent, useMemo } from 'react';
import {
  Switch,
  Route,
  RouteComponentProps,
  useRouteMatch,
} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { createStyles, makeStyles } from '@material-ui/core';

import { settingsActions } from '../../entities/settings';
import {
  settingsIntervalSelector,
  settingsStreamsOrderedListSelector,
  settingsIsRandomOrderSelector,
} from '../../entities/settings/selectors';

import Header, { HEADER_SIZE } from './header';
import SettingsForm, { FormData } from '../../ui/forms/settings';

interface SettingsProps extends RouteComponentProps {} // eslint-disable-line

const useStyles = makeStyles(() =>
  createStyles({
    wrapper: {
      position: 'relative',
      paddingBottom: '2rem',
    },
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

  const formData: FormData = useMemo(() => {
    const newLinks =
      links.length > 1
        ? links
        : // ensure having at least two fields set as default
          [
            {
              id: uuidv4(),
              value: '',
            },
            {
              id: uuidv4(),
              value: '',
            },
          ];
    return {
      interval: `${interval / 60000}`,
      random: isRandom,
      links: newLinks,
    };
  }, [interval, isRandom, links]);

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
    <div className={classes.wrapper}>
      <Header />
      <Container maxWidth="sm">
        <Box mt={`${HEADER_SIZE}px`}>
          <Typography className={classes.title} variant="h1" gutterBottom>
            Settings
          </Typography>
          <SettingsForm data={formData} onSave={handleSave} />
        </Box>
      </Container>
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
