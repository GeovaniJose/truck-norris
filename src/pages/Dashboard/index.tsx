import React, { useCallback, useEffect, useState } from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import {
  Box,
  Card,
  CardContent,
  Checkbox,
  CircularProgress,
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
  Star,
} from '@material-ui/icons';

import api from '../../services/api';

interface CheckboxOptionsData {
  nerdy: boolean;
  explicit: boolean;
}

interface TextFieldsValueData {
  firstName: string;
  lastName: string;
}

interface ApiGetParams {
  firstName?: string;
  lastName?: string;
  limitTo?: string;
  escape?: string;
}

interface JokeItem {
  id: number;
  joke: string;
  categories: string[];
  favorite: boolean;
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
      alignItems: 'center',
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
    progressBar: {
      color: theme.palette.success.main,
      marginTop: 15,
      marginBottom: 15,
    },
    jokesContainer: {
      padding: theme.spacing(4, 0),
    },
    jokesGridTitle: {
      color: theme.palette.secondary.dark,
    },
    jokesGrid: {
      listStyle: 'none',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
      gridGap: theme.spacing(3),
      margin: theme.spacing(4, 0),
      padding: 0,
    },
    jokesCard: {
      position: 'relative',
      height: '100%',
      display: 'flex',
      background: theme.palette.secondary.dark,
      color: theme.palette.primary.dark,
    },
    jokesCardContent: {
      textAlign: 'justify',
      padding: theme.spacing(3),
    },
    jokesCardIcon: {
      position: 'absolute',
      width: 30,
      top: 0,
      right: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderBottomLeftRadius: 15,
      background: theme.palette.primary.main,
    },
    iconStarBorder: {
      color: theme.palette.secondary.dark,
    },
    iconStarFilled: {
      color: theme.palette.warning.main,
    },
  }),
);

const Dashboard: React.FC = () => {
  const classes = useStyles();

  const [showFilter, setShowFilter] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [checkboxOptions, setCheckboxOptions] = useState<CheckboxOptionsData>({
    nerdy: false,
    explicit: false,
  });
  const [textFieldsValue, setTextFieldsValue] = useState<TextFieldsValueData>({
    firstName: '',
    lastName: '',
  });
  const [jokes, setJokes] = useState<JokeItem[]>([]);

  useEffect(() => {
    api
      .get('/jokes', {
        params: {
          escape: 'javascript',
        },
      })
      .then(response => {
        setJokes(
          response.data.value.map((data: JokeItem) => ({
            ...data,
            favorite: false,
          })),
        );
      });
  }, []);

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

  const handleFilterDone = useCallback(async () => {
    setIsLoading(true);
    const { firstName, lastName } = textFieldsValue;
    const { nerdy, explicit } = checkboxOptions;

    const params: ApiGetParams = {
      ...(firstName
        ? {
            firstName,
          }
        : {}),
      ...(lastName
        ? {
            lastName,
          }
        : {}),
      ...(nerdy || explicit
        ? {
            limitTo: `[${nerdy ? 'nerdy' : ''},${explicit ? 'explicit' : ''}]`,
          }
        : {}),
      escape: 'javascript',
    };

    api
      .get('/jokes', {
        params,
      })
      .then(response =>
        setJokes(
          response.data.value.map((data: JokeItem) => ({
            ...data,
            favorite: false,
          })),
        ),
      )
      .finally(() => {
        setIsLoading(false);
        setShowFilter(false);
      });
  }, [checkboxOptions, textFieldsValue]);

  const handleJokeFavorite = useCallback(
    (id: number) => {
      const formattedJokes = jokes.map(joke =>
        joke.id === id ? { ...joke, favorite: !joke.favorite } : joke,
      );

      setJokes(formattedJokes);
    },
    [jokes],
  );

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
              {!isLoading ? (
                <IconButton
                  className={classes.iconCheck}
                  component="span"
                  onClick={handleFilterDone}
                  title="Done"
                >
                  <DoneRounded fontSize="inherit" />
                </IconButton>
              ) : (
                <CircularProgress
                  className={classes.progressBar}
                  size={24}
                  color="secondary"
                />
              )}
            </>
          )}
        </Box>
      </Box>

      <Box className={classes.jokesContainer}>
        <Typography
          component="h1"
          variant="h4"
          className={classes.jokesGridTitle}
        >
          Jokes
        </Typography>
        <ul className={classes.jokesGrid}>
          {jokes.map(joke => (
            <li key={joke.id}>
              <Card elevation={3} className={classes.jokesCard}>
                <CardContent className={classes.jokesCardContent}>
                  <Typography component="strong" variant="h6">
                    {joke.joke}
                  </Typography>
                </CardContent>
                <section className={classes.jokesCardIcon}>
                  <IconButton
                    component="span"
                    size="small"
                    onClick={() => handleJokeFavorite(joke.id)}
                    title="Favorite"
                  >
                    {joke.favorite ? (
                      <Star
                        className={classes.iconStarFilled}
                        fontSize="default"
                      />
                    ) : (
                      <Star
                        className={classes.iconStarBorder}
                        fontSize="default"
                      />
                    )}
                  </IconButton>
                </section>
              </Card>
            </li>
          ))}
        </ul>
      </Box>
    </Container>
  );
};

export default Dashboard;
