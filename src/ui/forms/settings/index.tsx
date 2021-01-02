import React, { FC } from 'react';
import { v4 as uuiv4 } from 'uuid';

import { Formik, Form, FieldArray, getIn } from 'formik';

import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputAdornment from '@material-ui/core/InputAdornment';
import Switch from '@material-ui/core/Switch';
import FormHelperText from '@material-ui/core/FormHelperText';

import Add from '@material-ui/icons/Add';

import { createStyles, makeStyles } from '@material-ui/core';

import FormControl from '../../form-components/FormControl';
import InputLabel from '../../form-components/InputLabel';
import OrderList from '../../form-components/OrderList';

import { initialState } from './state';
import validationSchema from './validationSchema';

enum InputValues {
  INTERVAL = 'interval',
  RANDOM = 'random',
  LINKS = 'links',
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
      margin: '2rem 0',
    },
    textField: {
      width: '100%',
    },
    addWrapper: {
      display: 'flex',
      flexFlow: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      marginTop: '-1rem',
    },
    addButton: {
      marginLeft: '0.5rem',
    },
    buttonGroup: {
      display: 'flex',
      flexFlow: 'row',
      justifyContent: 'flex-end',

      '& button': {
        marginLeft: '0.5rem',
      },
    },
  })
);

const SettingsForm: FC = () => {
  const classes = useStyles();

  return (
    <Formik
      initialValues={initialState}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        // clean empty fields
        const newValues = {
          ...values,
          links: values.links.filter(
            ({ value }) => Boolean(value) && value.length > 0
          ),
        };
        // eslint-disable-next-line no-console
        console.log({ newValues });
      }}
    >
      {({ submitForm, handleChange, values, handleReset, errors }) => {
        const disabled = Object.values(errors).length > 0;

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
                endAdornment={
                  <InputAdornment position="end">min</InputAdornment>
                }
                onChange={handleChange}
                value={values.interval}
                error={Boolean(errors[InputValues.INTERVAL])}
              />
              {Boolean(errors[InputValues.INTERVAL]) && (
                <FormHelperText error>
                  {errors[InputValues.INTERVAL]}
                </FormHelperText>
              )}
            </FormControl>
            <FormControl
              inputLabel={
                <InputLabel htmlFor={InputValues.RANDOM}>
                  Use random order
                </InputLabel>
              }
            >
              <Switch
                id={InputValues.RANDOM}
                color="primary"
                onChange={handleChange}
                value={values.random}
              />
            </FormControl>
            <div className={classes.linksSection}>
              <InputLabel>Links</InputLabel>
              <FieldArray name={InputValues.LINKS}>
                {({ move, remove, push }) => {
                  const handleOnMove = (
                    _: unknown,
                    index: number,
                    nextIndex: number
                  ) => {
                    move(index, nextIndex);
                  };

                  const handleOnDelete = (_: unknown, index: number) => {
                    remove(index);
                  };

                  const handleOnChange = (
                    event: React.ChangeEvent<HTMLInputElement>
                  ) => {
                    handleChange(event);
                  };

                  const handleAdd = () => {
                    push({ id: uuiv4(), value: '' });
                  };

                  return (
                    <>
                      <OrderList
                        data={values.links}
                        onMove={handleOnMove}
                        onDelete={handleOnDelete}
                      >
                        {(id, value, i) => {
                          const linkValue = `links[${i}].value`;
                          const error = getIn(errors, linkValue);

                          return (
                            <Box>
                              <OutlinedInput
                                name={linkValue}
                                onChange={handleOnChange}
                                value={value}
                                error={Boolean(error)}
                                className={classes.textField}
                              />
                              {Boolean(error) && (
                                <FormHelperText error>{error}</FormHelperText>
                              )}
                            </Box>
                          );
                        }}
                      </OrderList>
                      <Box className={classes.addWrapper}>
                        <Typography>add another link</Typography>
                        <IconButton
                          className={classes.addButton}
                          onClick={handleAdd}
                        >
                          <Add />
                        </IconButton>
                      </Box>
                    </>
                  );
                }}
              </FieldArray>
            </div>
            <div className={classes.buttonGroup}>
              <Button color="secondary" onClick={handleReset}>
                Reset all
              </Button>
              <Button
                color="primary"
                variant="outlined"
                onClick={submitForm}
                disabled={disabled}
              >
                Save
              </Button>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default SettingsForm;
