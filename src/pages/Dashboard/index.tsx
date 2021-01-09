import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { VariableSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { Skeleton } from '@material-ui/lab';
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

import { useFavorite } from '../../hooks/favorite';
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
      display: 'flex',
      flexDirection: 'column',
      [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(0, 2),
      },
    },
    filterContainer: {
      width: '100%',
      maxWidth: 730,
      minHeight: 160,
      margin: '0 auto',
      display: 'flex',
      justifyContent: 'flex-end',
      [theme.breakpoints.down('sm')]: {
        minHeight: 0,
        flexDirection: 'column',
        alignItems: 'flex-end',
      },
    },
    filter: {
      display: 'flex',
      justifyContent: 'space-evenly',
      flexWrap: 'wrap',
      borderBottomLeftRadius: 20,
      background: theme.palette.primary.main,
      [theme.breakpoints.down('sm')]: {
        justifyContent: 'flex-start',
      },
    },
    formControl: {
      marginTop: theme.spacing(2),
      color: theme.palette.background.default,
      [theme.breakpoints.down('sm')]: {
        margin: theme.spacing(2, 0),
      },
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
      [theme.breakpoints.down('sm')]: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        borderBottomLeftRadius: 20,
      },
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
      [theme.breakpoints.down('sm')]: {
        margin: 15,
      },
    },
    mainContainer: {
      flex: 1,
      padding: theme.spacing(4, 0),
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    },
    jokesListTitle: {
      color: theme.palette.secondary.dark,
      marginBottom: theme.spacing(4),
    },
    jokesListContainer: {
      flex: 1,
      overflow: 'auto',
    },
    jokesListItem: {
      listStyle: 'none',
      padding: theme.spacing(0, 3, 2),
      [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(0, 0, 2),
      },
    },
    jokesCard: {
      position: 'relative',
      height: '100%',
      display: 'flex',
      background: theme.palette.secondary.dark,
      color: theme.palette.primary.dark,
    },
    jokesCardContent: {
      flex: 1,
      textAlign: 'justify',
      padding: theme.spacing(3),
      display: 'flex',
      alignItems: 'center',
      '& > h6': {
        flex: 1,
      },
    },
    jokesCardIcons: {
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
  const { favoriteJokes, addFavoriteJoke, removeFavoriteJoke } = useFavorite();

  const [showFilter, setShowFilter] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
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
        setJokes(response.data.value);
      })
      .finally(() => setIsLoading(false));
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

  const handleFilterDone = useCallback(() => {
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
      .then(response => setJokes(response.data.value))
      .finally(() => {
        setIsLoading(false);
        setShowFilter(false);
      });
  }, [checkboxOptions, textFieldsValue]);

  const jokesWithFavoriteSetted: JokeItem[] = useMemo(
    () =>
      jokes.map((data: JokeItem) => {
        if (favoriteJokes.some(joke => joke.joke === data.joke)) {
          return { ...data, favorite: true };
        }

        return { ...data, favorite: false };
      }),
    [jokes, favoriteJokes],
  );

  const handleToggleJokeFavorite = useCallback(
    (id: number) => {
      const formattedJokes = jokesWithFavoriteSetted.map(joke => {
        if (joke.id === id) {
          const toggledFavoriteJoke = { ...joke, favorite: !joke.favorite };

          if (toggledFavoriteJoke.favorite) {
            addFavoriteJoke(toggledFavoriteJoke);
          } else {
            removeFavoriteJoke(id);
          }

          return toggledFavoriteJoke;
        }

        return joke;
      });

      setJokes(formattedJokes);
    },
    [jokesWithFavoriteSetted, addFavoriteJoke, removeFavoriteJoke],
  );

  const renderRow = useCallback(
    ({ index, style }) => {
      const joke = jokesWithFavoriteSetted[index];

      return (
        <li key={joke.id} style={style} className={classes.jokesListItem}>
          <Card elevation={3} className={classes.jokesCard}>
            <CardContent className={classes.jokesCardContent}>
              <Typography component="strong" variant="h6">
                {joke.joke}
              </Typography>
            </CardContent>
            <section className={classes.jokesCardIcons}>
              <IconButton
                component="span"
                size="small"
                onClick={() => handleToggleJokeFavorite(joke.id)}
                title="Favorite"
              >
                {joke.favorite ? (
                  <Star className={classes.iconStarFilled} fontSize="default" />
                ) : (
                  <Star className={classes.iconStarBorder} fontSize="default" />
                )}
              </IconButton>
            </section>
          </Card>
        </li>
      );
    },
    [jokesWithFavoriteSetted, classes, handleToggleJokeFavorite],
  );

  const calculateItemSize = useCallback(
    (index: number) => {
      const size = jokes[index].joke.length;

      return size > 120 ? size : 120;
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
              <FormLabel component="legend">Personalize</FormLabel>
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

      <Box className={classes.mainContainer} component="main">
        <Typography
          component="h1"
          variant="h4"
          className={classes.jokesListTitle}
        >
          Jokes
        </Typography>

        <Box className={classes.jokesListContainer}>
          {!isLoading ? (
            <AutoSizer>
              {({ height, width }) => (
                <List
                  itemCount={jokes.length}
                  itemSize={calculateItemSize}
                  width={width}
                  height={height}
                  overscanCount={2}
                >
                  {renderRow}
                </List>
              )}
            </AutoSizer>
          ) : (
            [0, 1, 2, 3, 4].map(numb => (
              <li key={numb} className={classes.jokesListItem}>
                <Card elevation={3} className={classes.jokesCard}>
                  <CardContent className={classes.jokesCardContent}>
                    <Typography variant="h6">
                      <Skeleton variant="text" width="100%" animation="wave" />
                      <Skeleton variant="text" width="40%" animation="wave" />
                    </Typography>
                  </CardContent>
                  <section className={classes.jokesCardIcons}>
                    <IconButton component="span" size="small">
                      <Skeleton width={15} animation="wave" />
                    </IconButton>
                  </section>
                </Card>
              </li>
            ))
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default Dashboard;
