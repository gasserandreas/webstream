import React, { FC, ReactNode } from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() =>
  createStyles({
    form: {},
  })
);

type FormProps = {
  children: ReactNode;
};

const Form: FC<FormProps> = ({ children }) => {
  const classes = useStyles();
  return <form className={classes.form}>{children}</form>;
};

export default Form;
