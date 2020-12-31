import React, { FC } from 'react';

import clsx from 'clsx';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import MuiInputLabel, {
  InputLabelProps as MuiInputLabelProps,
} from '@material-ui/core/InputLabel';

// interface InputLabelProps extends MuiInputLabelProps {}

const useStyles = makeStyles(() =>
  createStyles({
    inputLabel: {
      display: 'block',
      position: 'relative',
      top: 'auto',
      left: 'auto',
      transform: 'none',
      margin: '1rem 0',
    },
  })
);

const InputLabel: FC<MuiInputLabelProps> = ({ className, ...props }) => {
  const classes = useStyles();

  const newClassName = className
    ? clsx(className, classes.inputLabel)
    : classes.inputLabel;

  return <MuiInputLabel className={newClassName} {...props} />;
};

export default InputLabel;
