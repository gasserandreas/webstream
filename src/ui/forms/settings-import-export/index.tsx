import React, { FC } from 'react';
import dayjs from 'dayjs';

import { Formik, Form } from 'formik';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormHelperText from '@material-ui/core/FormHelperText';
import { createStyles, makeStyles } from '@material-ui/core';

import DoneIcon from '@material-ui/icons/Done';

import FormControl from '../../form-components/FormControl';
import InputLabel from '../../form-components/InputLabel';

import validationSchema from './validationSchema';

import { LinkList } from '../../../entities/models';
import useResetState from '../../../hooks/useResetState';

enum InputValues {
  FILENAME = 'filename',
}

type SettingsImportExportFormProps = {
  data?: Data;
  disabled?: boolean;
  // onImport?: () => void;
  // onExport?: () => void;
};

export type Data = {
  interval: string;
  random: boolean;
  links: LinkList;
};

type FormData = {
  filename: string;
};

export const initialState: FormData = {
  filename: 'export',
};

const useStyles = makeStyles((theme) =>
  createStyles({
    filename: {
      width: `${theme.spacing(18)}px`,

      '& input': {
        textAlign: 'right',
      },
    },
    customFormControl: {
      '& > div:nth-child(2)': {
        display: 'flex',
        flexFlow: 'row',
        alignItems: 'start',
      },
    },
    export: {},
    exportButton: {
      height: '43px',
      marginLeft: '1rem',
    },
  })
);

const SettingsImportExportForm: FC<SettingsImportExportFormProps> = ({
  data,
  disabled,
}) => {
  const classes = useStyles();

  const [showSuccess, setShowSuccess] = useResetState<boolean>({
    initialState: false,
    time: 5000,
  });

  return (
    <Formik
      enableReinitialize
      initialValues={initialState}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        setShowSuccess(true);

        const expandedData = {
          data,
          exported: dayjs(Date.now()).format('YYYY-MM-DDTHH:mm:ssZ[Z]'),
          version: '1.0.0',
        };

        const dataString = JSON.stringify(expandedData);
        const downloadName = `${values.filename}.json`;

        /**
         * Create new a tag to support download
         */
        const element = document.createElement('a');
        const file = new Blob([dataString], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = downloadName;
        document.body.appendChild(element); // Required for this to work in FireFox

        // download file
        element.click();

        // remove a tag from body again
        setTimeout(() => {
          if (element) {
            document.body.removeChild(element);
          }
        }, 500);
      }}
    >
      {({ submitForm, handleChange, values, errors }) => {
        const buttonDisabled = disabled || Object.values(errors).length > 0;

        return (
          <Form>
            <FormControl
              inputLabel={
                <InputLabel htmlFor={InputValues.FILENAME}>Filename</InputLabel>
              }
              className={classes.customFormControl}
            >
              <Box className={classes.export}>
                <OutlinedInput
                  id={InputValues.FILENAME}
                  className={classes.filename}
                  endAdornment={
                    <InputAdornment position="end">.json</InputAdornment>
                  }
                  onChange={handleChange}
                  value={values.filename}
                  error={Boolean(errors[InputValues.FILENAME])}
                />
                {Boolean(errors[InputValues.FILENAME]) && (
                  <FormHelperText error>
                    {errors[InputValues.FILENAME]}
                  </FormHelperText>
                )}
              </Box>
              <Button
                color="primary"
                variant="outlined"
                onClick={submitForm}
                className={classes.exportButton}
                disabled={buttonDisabled || !!showSuccess}
                endIcon={showSuccess && <DoneIcon />}
              >
                {showSuccess ? 'Exported' : 'Export'}
              </Button>
            </FormControl>
            {disabled && (
              <FormHelperText error>
                Settings cannot be exported due to errors in the form
              </FormHelperText>
            )}
          </Form>
        );
      }}
    </Formik>
  );
};

export default SettingsImportExportForm;
