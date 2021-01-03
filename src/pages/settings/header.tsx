import React, { FC } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { makeStyles, createStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';

import { INDEX } from '../../constants/paths';
import useTimeDifferenceMessage from '../../hooks/useTimeDifferenceMessage';

import { settingsMetaLastSavedSelector } from '../../entities/settings/selectors';

export const HEADER_SIZE = 40;

const useStyles = makeStyles(() =>
  createStyles({
    header: {
      height: `${HEADER_SIZE}px`,
      display: 'flex',
      justifyContent: 'space-between',
      padding: '0.5rem',
    },
    leftSide: {},
    rightSide: {},
  })
);

const Header: FC = () => {
  const classes = useStyles();

  const lastSaved = useSelector(settingsMetaLastSavedSelector);
  const lastSavedMessage = useTimeDifferenceMessage(lastSaved);

  return (
    <Box className={classes.header}>
      <Box className={classes.leftSide}>
        <Link component={RouterLink} to={INDEX}>
          go back to home
        </Link>
      </Box>
      <Box className={classes.rightSide}>
        <Typography variant="body2" display="block">
          Last saved:{' '}
          <Typography
            component="span"
            color="primary"
            variant="body2"
            display="inline"
          >
            {lastSaved ? lastSavedMessage : 'never'}
          </Typography>
        </Typography>
      </Box>
    </Box>
  );
};

export default Header;
