import React, { FC, ReactNode } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';

import clsx from 'clsx';
import MuiFormControl, {
  FormControlProps as MuiFormControlProps,
} from '@material-ui/core/FormControl';

interface FormControlProps extends MuiFormControlProps {
  inputLabel: ReactNode;
}

export const FORM_CONTROL_MARGIN = '1rem 0';

const useStyles = makeStyles(() =>
  createStyles({
    formControl: {
      width: '100%',
      display: 'flex',
      flexFlow: 'row',
      flexWrap: 'nowrap',
      justifyContent: 'space-between',
      margin: FORM_CONTROL_MARGIN,
    },
    labelWrapper: {},
    inputWrapper: {
      display: 'flex',
      flexFlow: 'column',
      alignItems: 'flex-end',
    },
  })
);

const FormControl: FC<FormControlProps> = ({
  inputLabel,
  children,
  className,
  ...props
}) => {
  const classes = useStyles();

  const newClassName = className
    ? clsx(className, classes.formControl)
    : classes.formControl;

  /**
   * return default FormControl component
   */
  if (!inputLabel) {
    return <MuiFormControl className={newClassName} {...props} />;
  }

  return (
    <MuiFormControl className={newClassName} {...props}>
      <div className={classes.labelWrapper}>{inputLabel}</div>
      <div className={classes.inputWrapper}>{children}</div>
    </MuiFormControl>
  );
};

export default FormControl;
