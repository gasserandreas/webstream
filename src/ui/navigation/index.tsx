import React, { FC, ReactNode } from 'react';

import { makeStyles, createStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';

type NavigationProps = {
  bottomElements?: Array<ReactNode>;
};

export const NAVIGATION_WIDTH = 40;

const useStyles = makeStyles((theme) =>
  createStyles({
    navigation: {
      position: 'fixed',
      top: 0,
      left: 0,
      bottom: 0,
      width: `${NAVIGATION_WIDTH}px`,
      zIndex: 1,
      backgroundColor: theme.palette.background.paper,
      display: 'flex',
      flexFlow: 'column',
      padding: '0.5rem 0.25rem',
    },
    navigationContent: {
      flexGrow: 1,
      flexShrink: 1,
    },
    navigationBottom: {
      flexGrow: 0,
      flexShrink: 0,
    },
    visible: {
      left: 0,
    },
  })
);

const Navigation: FC<NavigationProps> = ({ children, bottomElements }) => {
  const classes = useStyles();

  return (
    <Box className={classes.navigation} boxShadow="1">
      <Box className={classes.navigationContent}>{children}</Box>
      <Box className={classes.navigationBottom}>{bottomElements}</Box>
    </Box>
  );
};

export default Navigation;
