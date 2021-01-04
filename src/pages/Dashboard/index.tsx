import React, { useCallback, useState } from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import {
  Box,
  Checkbox,
  Container,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  IconButton,
  TextField,
  Typography,
} from '@material-ui/core';
import {
  FilterListRounded,
  ClearRounded,
  DoneRounded,
} from '@material-ui/icons';

interface CheckboxOptionsData {
  nerdy: boolean;
  explicit: boolean;
}

interface TextFieldsValueData {
  firstName: string;
  lastName: string;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(0, 9),
    },
    filterContainer: {
      maxWidth: 730,
      height: 160,
      margin: '0 auto',
      display: 'flex',
      justifyContent: 'flex-end',
    },
    filter: {
      display: 'flex',
      justifyContent: 'space-evenly',
      borderBottomLeftRadius: 20,
      background: theme.palette.primary.main,
    },
    formControl: {
      marginTop: theme.spacing(2),
      color: theme.palette.background.default,
      '& > .MuiFormLabel-root': {
        color: theme.palette.background.default,
        '&.Mui-focused': {
          color: theme.palette.background.default,
        },
      },
      '& .MuiTextField-root': {
        color: theme.palette.background.default,
        marginTop: theme.spacing(1),
        width: 200,
        '& > .MuiInputBase-root': {
          color: theme.palette.background.default,
        },
        '& > label': {
          color: theme.palette.background.default,
          opacity: 0.7,
          '&.MuiFormLabel-filled': {
            color: theme.palette.secondary.main,
            opacity: 1,
          },
        },
        '& .MuiFilledInput-underline:before': {
          borderBottomColor: theme.palette.primary.main,
        },
      },
    },
    checkbox: {
      color: theme.palette.background.default,
    },
    iconsContainer: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      padding: theme.spacing(1),
      borderBottomRightRadius: 20,
      background: theme.palette.primary.main,
    },
    icon: {
      fontSize: 30,
      color: theme.palette.background.default,
    },
    iconCheck: {
      fontSize: 30,
      color: theme.palette.success.main,
    },
    iconCancel: {
      fontSize: 30,
      color: theme.palette.error.main,
    },
  }),
);

const Dashboard: React.FC = () => {
  const classes = useStyles();

  const [showFilter, setShowFilter] = useState(false);
  const [checkboxOptions, setCheckboxOptions] = useState<CheckboxOptionsData>({
    nerdy: false,
    explicit: false,
  });
  const [textFieldsValue, setTextFieldsValue] = useState<TextFieldsValueData>({
    firstName: '',
    lastName: '',
  });

  const handleShowFilter = useCallback(() => {
    setShowFilter(!showFilter);
  }, [showFilter]);

  const handleCheckboxChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setCheckboxOptions({
        ...checkboxOptions,
        [event.target.name]: event.target.checked,
      });
    },
    [checkboxOptions],
  );

  const handleTextFieldChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setTextFieldsValue({
        ...textFieldsValue,
        [event.target.name]: event.target.value,
      });
    },
    [textFieldsValue],
  );

  const handleFilterDone = useCallback(() => {
    console.log(checkboxOptions);
    console.log(textFieldsValue);
  }, [checkboxOptions, textFieldsValue]);

  return (
    <Container className={classes.root}>
      <Box className={classes.filterContainer}>
        {showFilter && (
          <Container className={classes.filter}>
            <FormControl component="fieldset" className={classes.formControl}>
              <FormLabel component="legend">Categories</FormLabel>
              <FormGroup>
                <FormControlLabel
                  control={
                    // eslint-disable-next-line react/jsx-wrap-multilines
                    <Checkbox
                      className={classes.checkbox}
                      name="nerdy"
                      checked={checkboxOptions.nerdy}
                      onChange={handleCheckboxChange}
                    />
                  }
                  label="Nerdy"
                />
                <FormControlLabel
                  control={
                    // eslint-disable-next-line react/jsx-wrap-multilines
                    <Checkbox
                      className={classes.checkbox}
                      name="explicit"
                      checked={checkboxOptions.explicit}
                      onChange={handleCheckboxChange}
                    />
                  }
                  label="Explicit"
                />
              </FormGroup>
            </FormControl>

            <FormControl component="fieldset" className={classes.formControl}>
              <FormLabel component="legend">Personalized</FormLabel>
              <TextField
                name="firstName"
                label="First Name"
                size="small"
                variant="filled"
                value={textFieldsValue.firstName}
                onChange={handleTextFieldChange}
              />
              <TextField
                name="lastName"
                label="Last Name"
                size="small"
                variant="filled"
                value={textFieldsValue.lastName}
                onChange={handleTextFieldChange}
              />
            </FormControl>
          </Container>
        )}

        <Box className={classes.iconsContainer}>
          {!showFilter ? (
            <IconButton
              className={classes.icon}
              component="span"
              onClick={handleShowFilter}
              title="Show filter"
            >
              <FilterListRounded fontSize="inherit" />
            </IconButton>
          ) : (
            <>
              <IconButton
                className={classes.iconCancel}
                component="span"
                onClick={handleShowFilter}
                title="Cancel"
              >
                <ClearRounded fontSize="inherit" />
              </IconButton>
              <IconButton
                className={classes.iconCheck}
                component="span"
                onClick={handleFilterDone}
                title="Done"
              >
                <DoneRounded fontSize="inherit" />
              </IconButton>
            </>
          )}
        </Box>
      </Box>
      <Typography variant="h1" component="h1">
        Dashboard
      </Typography>
    </Container>
  );
};

export default Dashboard;
