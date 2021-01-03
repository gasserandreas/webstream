import React, { FC, ReactNode, useState } from 'react';

import { makeStyles, createStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import clsx from 'clsx';

type NavigationProps = {
  bottomElements?: Array<ReactNode>;
};

const useStyles = makeStyles((theme) => {
  const navigationWidth = theme.spacing(7.25);
  const hoverAreaWidth = theme.spacing(4);

  return createStyles({
    wrapper: {
      position: 'fixed',
      top: 0,
      bottom: 0,
      left: `-${navigationWidth}px`,
      width: `${navigationWidth + hoverAreaWidth}px`,
      zIndex: 1,
      display: 'flex',
      flexFlow: 'row',
      justifyContent: 'stretch',
    },
    hoverArea: {
      width: `${hoverAreaWidth}px`,
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      cursor: 'pointer',
    },
    navigation: {
      flexShrink: 1,
      flexGrow: 1,
      backgroundColor: theme.palette.background.paper,
      display: 'flex',
      flexFlow: 'column',
      padding: '0.5rem 0.25rem',
      width: `${navigationWidth}px`,
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
  });
});

const Navigation: FC<NavigationProps> = ({ children, bottomElements }) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [alwaysVisible, setAlwaysVisible] = useState<boolean>(false);

  const classes = useStyles({
    isVisible: isVisible || alwaysVisible,
  });

  const handleOnMouseEnter = () => {
    setIsVisible(true);
  };

  const handleOnMouseLeave = () => {
    setIsVisible(false);
  };

  const handleHoverClick = () => {
    setAlwaysVisible((prev) => !prev);
  };

  const wrapperClassName = isVisible
    ? clsx(classes.wrapper, classes.visible)
    : classes.wrapper;

  return (
    <div
      className={wrapperClassName}
      onMouseEnter={handleOnMouseEnter}
      onMouseLeave={handleOnMouseLeave}
    >
      <Box className={classes.navigation}>
        <Box className={classes.navigationContent}>{children}</Box>
        <Box className={classes.navigationBottom}>{bottomElements}</Box>
      </Box>
      <Box className={classes.hoverArea} onClick={handleHoverClick} />
    </div>
  );
};

export default Navigation;
