import React, { FC } from 'react';

import clsx from 'clsx';
import { makeStyles, createStyles } from '@material-ui/core/styles';

import IconButton, { IconButtonProps } from '@material-ui/core/IconButton';

interface ItemProps extends IconButtonProps {
  className?: string;
}

const useStyles = makeStyles(() =>
  createStyles({
    icon: {
      margin: '0.25rem 0',
    },
  })
);

const Item: FC<ItemProps> = ({ className, ...props }) => {
  const classes = useStyles();

  const newClassName = className ? clsx(className, classes.icon) : className;

  return <IconButton className={newClassName} {...props} />;
};

export default Item;
