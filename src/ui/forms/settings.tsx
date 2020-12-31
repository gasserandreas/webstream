import React, { FC } from 'react';

// import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputAdornment from '@material-ui/core/InputAdornment';
import Switch from '@material-ui/core/Switch';

import { createStyles, makeStyles } from '@material-ui/core';

import Form from '../form-components/Form';
import FormControl from '../form-components/FormControl';
import InputLabel from '../form-components/InputLabel';

enum InputValues {
  TIMEOUT = 'timeout',
  RANDOM = 'random',
}

const useStyles = makeStyles((theme) =>
  createStyles({
    timeoutInput: {
      width: `${theme.spacing(18)}px`,
    },
    linksSection: {
      margin: '2rem 0  1rem 0',
    },
  })
);

const SettingsForm: FC = () => {
  const classes = useStyles();

  return (
    <Form>
      <FormControl
        inputLabel={
          <InputLabel htmlFor={InputValues.TIMEOUT}>Change interval</InputLabel>
        }
      >
        <OutlinedInput
          id={InputValues.TIMEOUT}
          className={classes.timeoutInput}
          endAdornment={<InputAdornment position="end">min</InputAdornment>}
        />
      </FormControl>
      <FormControl
        inputLabel={
          <InputLabel htmlFor={InputValues.RANDOM}>Use random order</InputLabel>
        }
      >
        <Switch id={InputValues.RANDOM} color="primary" />
      </FormControl>
      <div className={classes.linksSection}>
        <InputLabel>Links</InputLabel>
      </div>
    </Form>
  );
};

export default SettingsForm;
