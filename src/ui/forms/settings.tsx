import React, { FC, useState } from 'react';

import { v4 as uuidv4 } from 'uuid';

// import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputAdornment from '@material-ui/core/InputAdornment';
import Switch from '@material-ui/core/Switch';

import { createStyles, makeStyles } from '@material-ui/core';

import Form from '../form-components/Form';
import FormControl from '../form-components/FormControl';
import InputLabel from '../form-components/InputLabel';
import OrderList, { OrderListData } from '../form-components/OrderList';

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

  const initialItems = [
    {
      id: uuidv4(),
      value: 'no value 1',
      label: 'No label 1',
      data: {},
    },
    {
      id: uuidv4(),
      value: 'no value 2',
      label: 'No label 2',
      data: {},
    },
    {
      id: uuidv4(),
      value: 'no value 3',
      label: 'No label 3',
      data: {},
    },
    {
      id: uuidv4(),
      value: 'no value 4',
      label: 'No label 4',
      data: {},
    },
  ];

  const [items, setItems] = useState<OrderListData>(initialItems);

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
        <OrderList data={items} onChange={(_, newData) => setItems(newData)}>
          {(id, label) => {
            // console.log({ id });
            // console.log({ label });
            // console.log({ i });
            // console.log({ dataItem });
            return <div>{label}</div>;
          }}
        </OrderList>
      </div>
    </Form>
  );
};

export default SettingsForm;
