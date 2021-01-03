import React, { FC, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';

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

import { LinkList } from '../../../entities/models';

import validationSchema from './validationSchema';

enum InputValues {
  INTERVAL = 'interval',
  RANDOM = 'random',
  LINKS = 'links',
}

type SettingsFormProps = {
  data?: FormData;
  onSave: (values: FormData) => void;
};

export type FormData = {
  interval: string;
  random: boolean;
  links: LinkList;
};

export const initialState: FormData = {
  interval: '30000',
  random: false,
  links: [
    {
      id: uuidv4(),
      value: '',
    },
  ],
};

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
    linkErrorText: {
      textAlign: 'right',
      marginBottom: '2rem',
    },
  })
);

const SettingsForm: FC<SettingsFormProps> = ({ data, onSave }) => {
  const classes = useStyles();

  const initialValues = useMemo(() => {
    if (!data) {
      return initialState;
    }
    return data;
  }, [data]);

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        // clean empty fields
        const newValues = {
          ...values,
          links: values.links.filter(
            ({ value }) => Boolean(value) && value.length > 0
          ),
        };

        onSave(newValues);
      }}
    >
      {/* {({ submitForm, handleChange, values, handleReset, errors }) => { */}
      {({ submitForm, validateForm, handleChange, values, errors }) => {
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
              disabled
            >
              <Switch
                id={InputValues.RANDOM}
                color="primary"
                onChange={handleChange}
                value={values.random}
              />
              <FormHelperText>(not yet implemented)</FormHelperText>
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
                    /**
                     * manual triggering validation after update
                     * as workaround for formik FieldArray validation
                     * issue: https://github.com/formium/formik/issues/2378
                     */
                    setTimeout(() => {
                      validateForm();
                    }, 10);
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
                    push({ id: uuidv4(), value: '' });
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
                      {errors.links && (
                        <FormHelperText className={classes.linkErrorText} error>
                          {errors.links}
                        </FormHelperText>
                      )}
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
              {/* <Button color="secondary" onClick={handleReset}>
                Reset all
              </Button> */}
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
