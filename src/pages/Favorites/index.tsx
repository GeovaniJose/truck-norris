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
  Typography,
} from '@material-ui/core';
import {
  FilterListRounded,
  ClearRounded,
  DoneRounded,
  Star,
} from '@material-ui/icons';

import { useFavorite } from '../../hooks/favorite';

interface CheckboxOptionsData {
  nerdy: boolean;
  explicit: boolean;
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
      [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(0, 2),
      },
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
    mainContainer: {
      padding: theme.spacing(4, 0),
    },
    jokesGridTitle: {
      color: theme.palette.secondary.dark,
    },
    jokesEmpty: {
      textAlign: 'center',
      margin: theme.spacing(4, 0),
      color: theme.palette.primary.light,
      opacity: 0.5,
    },
    jokesGrid: {
      listStyle: 'none',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
      gridGap: theme.spacing(3),
      margin: theme.spacing(4, 0),
      padding: 0,
      [theme.breakpoints.down('sm')]: {
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
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

const Favorites: React.FC = () => {
  const classes = useStyles();

  const { favoriteJokes, removeFavoriteJoke } = useFavorite();

  const [jokes, setJokes] = useState<JokeItem[]>([]);
  const [showFilter, setShowFilter] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [checkboxOptions, setCheckboxOptions] = useState<CheckboxOptionsData>({
    nerdy: false,
    explicit: false,
  });

  useEffect(() => {
    setIsLoading(true);
    setJokes(favoriteJokes);
    setIsLoading(false);
  }, [favoriteJokes]);

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

  const handleJokeFavorite = useCallback(
    (id: number) => {
      removeFavoriteJoke(id);
    },
    [removeFavoriteJoke],
  );

  const handleFilterDone = useCallback(() => {
    if (!checkboxOptions.nerdy && !checkboxOptions.explicit) {
      setJokes(favoriteJokes);
      return;
    }

    setIsLoading(true);

    let filteredJokes = [] as JokeItem[];

    if (checkboxOptions.nerdy) {
      filteredJokes = favoriteJokes.filter(joke =>
        joke.categories.includes('nerdy'),
      );
    }

    if (checkboxOptions.explicit) {
      filteredJokes = [
        ...filteredJokes,
        ...favoriteJokes.filter(joke => joke.categories.includes('explicit')),
      ];
    }

    setJokes(filteredJokes);
    setIsLoading(false);
  }, [favoriteJokes, checkboxOptions]);

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

      <Box className={classes.mainContainer}>
        <Typography
          component="h1"
          variant="h4"
          className={classes.jokesGridTitle}
        >
          Favorites
        </Typography>
        <ul className={classes.jokesGrid}>
          {!isLoading &&
            jokes.map(joke => (
              <li key={joke.id}>
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

        {!isLoading && jokes.length === 0 && (
          <Box className={classes.jokesEmpty}>
            <Typography component="p" variant="h4">
              You haven&apos;t favorited anything yet.
            </Typography>
            <Typography component="span" variant="h5">
              Start adding jokes to favorites
            </Typography>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default Favorites;
