import React, { FC, useState } from 'react';

import { v4 as uuidv4 } from 'uuid';

import Button from '@material-ui/core/Button';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputAdornment from '@material-ui/core/InputAdornment';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';

import { createStyles, makeStyles } from '@material-ui/core';

import Form from '../form-components/Form';
import FormControl from '../form-components/FormControl';
import InputLabel from '../form-components/InputLabel';
import OrderList, { OrderListData } from '../form-components/OrderList';

enum InputValues {
  INTERVAL = 'interval',
  RANDOM = 'random',
}

const useStyles = makeStyles((theme) =>
  createStyles({
    interval: {
      width: `${theme.spacing(18)}px`,

      '& input': {
        textAlign: 'right',
      },
    },
    linksSection: {
      margin: '2rem 0  1rem 0',
    },
    textField: {
      width: '100%',
    },
    buttonGroup: {
      display: 'flex',
      flexFlow: 'row',
      justifyContent: 'flex-end',
    },
  })
);

type FormData = {
  interval: string;
  random: boolean;
  items: OrderListData;
};

const initialState: FormData = {
  interval: '5',
  random: false,
  items: [
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
  ],
};

const SettingsForm: FC = () => {
  const classes = useStyles();

  const [data, setData] = useState<FormData>(initialState);

  const handleIntervalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({
      ...data,
      interval: e.target.value,
    });
  };

  const handleRandomOrderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({
      ...data,
      random: e.target.value === 'true',
    });
  };

  /**
   * Handle order changes
   * @param _
   * @param items
   */
  const handleOrderChange = (_: unknown, items: OrderListData) => {
    setData({
      ...data,
      items,
    });
  };

  /**
   * Handle input data changes
   * @param i
   */
  const handleInputChange = (i: number) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newItems = [...data.items];
    const item = newItems[i];

    // update items
    newItems[i] = {
      ...item,
      value: e.target.value,
      label: e.target.value,
    };

    const newData = {
      ...data,
      items: newItems,
    };
    setData(newData);
  };

  const handleReset = () => {
    setData({ ...initialState });
  };

  return (
    <Form>
      <FormControl
        inputLabel={
          <InputLabel htmlFor={InputValues.INTERVAL}>
            Change interval
          </InputLabel>
        }
      >
        <OutlinedInput
          id={InputValues.INTERVAL}
          className={classes.interval}
          endAdornment={<InputAdornment position="end">min</InputAdornment>}
          onChange={handleIntervalChange}
          value={data.interval}
        />
      </FormControl>
      <FormControl
        inputLabel={
          <InputLabel htmlFor={InputValues.RANDOM}>Use random order</InputLabel>
        }
      >
        <Switch
          id={InputValues.RANDOM}
          color="primary"
          onChange={handleRandomOrderChange}
          value={data.random}
        />
      </FormControl>
      <div className={classes.linksSection}>
        <InputLabel>Links</InputLabel>
        <OrderList data={data.items} onChange={handleOrderChange}>
          {(id, label, i) => (
            <TextField
              onChange={handleInputChange(i)}
              value={label}
              variant="outlined"
              className={classes.textField}
            />
          )}
        </OrderList>
      </div>
      <div className={classes.buttonGroup}>
        <Button color="secondary" variant="outlined" onClick={handleReset}>
          Reset all
        </Button>
      </div>
    </Form>
  );
};

export default SettingsForm;
