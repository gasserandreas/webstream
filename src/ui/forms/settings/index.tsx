import React, { FC, useMemo, useState, useCallback, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useDispatch } from 'react-redux';

import { Formik, Form, FieldArray, getIn } from 'formik';
import { useDropzone } from 'react-dropzone';
import ProgressEvent from 'react-dropzone/typings/react-dropzone';

import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputAdornment from '@material-ui/core/InputAdornment';
import Switch from '@material-ui/core/Switch';
import FormHelperText from '@material-ui/core/FormHelperText';
import Collapse from '@material-ui/core/Collapse';
import { createStyles, makeStyles } from '@material-ui/core';

import Add from '@material-ui/icons/Add';
import DoneIcon from '@material-ui/icons/Done';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

import SettingsImportExportForm from '../settings-import-export';

import FormControl from '../../form-components/FormControl';
import InputLabel from '../../form-components/InputLabel';
import OrderList from '../../form-components/OrderList';

import { LinkList } from '../../../entities/models';
import { setSettings } from '../../../entities/settings';

import useResetState from '../../../hooks/useResetState';

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

function convertValues(values: FormData): FormData {
  const newValues = {
    ...values,
    links: values.links.filter(
      ({ value }) => Boolean(value) && value.length > 0
    ),
  };
  return newValues;
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
    },
    addLink: {
      display: 'flex',
      '&&:hover': {
        color: theme.palette.primary.main,
        cursor: 'pointer',
      },
    },
    addIcon: {
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
    advancedSection: {
      marginBottom: '2rem',
    },
    advancedSectionLabel: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      cursor: 'pointer',
      fontWeight: 700,
    },
    dropzone: {
      border: `2px dashed ${theme.palette.grey[400]}`,
      borderRadius: '4px',
      padding: '2rem',
      textAlign: 'center',
      color: theme.palette.text.secondary,
      outline: 'none',
      '&&:hover': {
        borderColor: theme.palette.primary.light,
        color: theme.palette.primary.main,
        cursor: 'pointer',
        backgroundColor: theme.palette.grey[100],
      },
    },
  })
);

const SettingsForm: FC<SettingsFormProps> = ({ data, onSave }) => {
  const classes = useStyles();

  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [uploadError, setUploadError] = useState<Error | null>(null);
  const setFieldRef = useRef<
    (field: string, value: unknown, shouldValidate?: boolean) => void | null
  >();

  const [showSuccess, setShowSuccess] = useResetState<boolean>({
    initialState: false,
    time: 5000,
  });

  const initialValues = useMemo(() => {
    if (!data) {
      return initialState;
    }
    return data;
  }, [data]);

  const handleOnDrop = useCallback(
    (acceptedFiles) => {
      // console.log('onCallback');
      if (acceptedFiles.length === 0 || acceptedFiles.length > 1) return;

      const file = acceptedFiles[0];
      const reader = new FileReader();

      reader.onerror = () =>
        setUploadError(new Error('Could not download file.'));
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const text = e?.target?.result as string;

        if (!text) {
          return;
        }

        const {
          data: { interval: rawInterval, links, random },
        } = JSON.parse(text);

        const interval = rawInterval * 60000;

        dispatch(setSettings(interval, random, links));
        setShowSuccess(true);
        setOpen(false);

        const setFieldValue = setFieldRef.current;
        if (setFieldValue) {
          setFieldValue('links', links);
        }
      };
      reader.readAsText(file);
    },
    [dispatch, setShowSuccess, setOpen]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleOnDrop,
    accept: 'application/json',
  });

  // console.log({ initialValues });
  // console.log({ data });

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        // clean empty fields
        const newValues = convertValues(values);

        // show save message
        setShowSuccess(true);

        onSave(newValues);
      }}
    >
      {/* {({ submitForm, handleChange, values, handleReset, errors }) => { */}
      {({
        submitForm,
        validateForm,
        handleChange,
        values,
        errors,
        setFieldValue,
      }) => {
        setFieldRef.current = setFieldValue;
        const disabled = Object.values(errors).length > 0;

        const showGeneralLinkError =
          errors.links && !Array.isArray(errors.links);

        // console.log({ values });
        setFieldRef.current = setFieldValue;

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
                      {showGeneralLinkError && (
                        <FormHelperText className={classes.linkErrorText} error>
                          {errors.links}
                        </FormHelperText>
                      )}
                      <Box className={classes.addWrapper}>
                        <Typography
                          className={classes.addLink}
                          onClick={handleAdd}
                        >
                          add another link
                          <Add className={classes.addIcon} />
                        </Typography>
                      </Box>
                    </>
                  );
                }}
              </FieldArray>
            </div>
            <div className={classes.advancedSection}>
              <InputLabel
                className={classes.advancedSectionLabel}
                onClick={() => setOpen((prev) => !prev)}
              >
                <span>Import / Export</span>
                {open ? <ExpandLess /> : <ExpandMore />}
              </InputLabel>
              <Collapse in={open} timeout="auto" unmountOnExit>
                <SettingsImportExportForm
                  data={convertValues(values)}
                  disabled={disabled}
                />
                <div className={classes.dropzone} {...getRootProps()}>
                  <input {...getInputProps()} />
                  <Typography>
                    Drag n drop some files here, or click to select files
                  </Typography>
                </div>
                {uploadError && (
                  <FormHelperText error>{uploadError.message}</FormHelperText>
                )}
              </Collapse>
            </div>
            <div className={classes.buttonGroup}>
              {/* <Button color="secondary" onClick={handleReset}>
                Reset all
              </Button> */}
              <Button
                color="primary"
                variant="outlined"
                onClick={submitForm}
                disabled={disabled || !!showSuccess}
                endIcon={showSuccess && <DoneIcon />}
              >
                {showSuccess ? 'Saved' : 'Save'}
              </Button>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default SettingsForm;
