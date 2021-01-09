import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import {
  Box,
  Drawer,
  SwipeableDrawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Hidden,
  useTheme,
} from '@material-ui/core';
import { Dashboard, Repeat, Star } from '@material-ui/icons';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: 255,
      flexShrink: 0,
    },
    drawerPaper: {
      width: 255,
      padding: theme.spacing(9, 0, 5),
      display: 'flex',
      background: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      border: 0,
    },
    logo: {
      fontSize: 40,
      fontWeight: 'bold',
      fontStyle: 'italic',
    },
    menu: {
      flex: 1,
      margin: theme.spacing(8, 0, 0, 4),
    },
    menuItem: {
      marginBottom: theme.spacing(2),
      borderRadius: theme.spacing(3, 0, 0, 3),
      boxShadow: 'none',
      '&:hover': {
        backgroundColor: theme.palette.background.default,
        color: theme.palette.primary.main,
      },
      '&.Mui-selected': {
        backgroundColor: theme.palette.background.default,
        color: theme.palette.primary.main,
      },
      '&.Mui-selected:hover': {
        backgroundColor: theme.palette.background.default,
        color: theme.palette.primary.main,
      },
    },
    menuItemIcon: {
      minWidth: 32,
      color: 'inherit',
      fontSize: 22,
    },
    copyright: {
      fontSize: 'small',
      textAlign: 'center',
      color: 'rgb(70, 247, 168, 0.3)',
    },
  }),
);

const Navbar: React.FC = () => {
  const classes = useStyles();
  const { pathname } = useLocation();
  const { breakpoints } = useTheme();

  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (window.innerWidth < breakpoints.values.sm) {
      setDrawerOpen(true);
      setTimeout(() => {
        setDrawerOpen(false);
      }, 500);
    }
  }, [breakpoints]);

  return (
    <>
      <Helmet defaultTitle="Truck Norris">
        {pathname === '/' && <title>Dashboard | Truck Norris</title>}
        {pathname === '/random' && <title>Random | Truck Norris</title>}
        {pathname === '/favorites' && <title>Favorites | Truck Norris</title>}
      </Helmet>

      <Hidden xsDown implementation="css">
        <nav className={classes.root}>
          <Drawer
            variant="permanent"
            anchor="left"
            classes={{ paper: classes.drawerPaper }}
          >
            <Box display="flex" justifyContent="center">
              <Typography
                className={classes.logo}
                variant="h3"
                component="h1"
                color="secondary"
              >
                truck
              </Typography>
              <Typography className={classes.logo} variant="h4" component="h1">
                norris
              </Typography>
            </Box>

            <List className={classes.menu}>
              <ListItem
                className={classes.menuItem}
                key="Jokes"
                button
                component={RouterLink}
                to="/"
                selected={pathname === '/'}
              >
                <ListItemIcon className={classes.menuItemIcon}>
                  <Dashboard fontSize="inherit" />
                </ListItemIcon>
                <ListItemText primary="Jokes" />
              </ListItem>
              <ListItem
                className={classes.menuItem}
                key="Random"
                button
                component={RouterLink}
                to="/random"
                selected={pathname === '/random'}
              >
                <ListItemIcon className={classes.menuItemIcon}>
                  <Repeat fontSize="inherit" />
                </ListItemIcon>
                <ListItemText primary="Random" />
              </ListItem>
              <ListItem
                className={classes.menuItem}
                key="Favorites"
                button
                component={RouterLink}
                to="/favorites"
                selected={pathname === '/favorites'}
              >
                <ListItemIcon className={classes.menuItemIcon}>
                  <Star fontSize="inherit" />
                </ListItemIcon>
                <ListItemText primary="Favorites" />
              </ListItem>
            </List>

            <Typography classes={{ root: classes.copyright }}>
              Coded with ❤️ by Geovani
            </Typography>
          </Drawer>
        </nav>
      </Hidden>

      <Hidden smUp implementation="css">
        <SwipeableDrawer
          anchor="left"
          classes={{ paper: classes.drawerPaper }}
          open={drawerOpen}
          onOpen={() => setDrawerOpen(true)}
          onClose={() => setDrawerOpen(false)}
          ModalProps={{
            keepMounted: true,
          }}
        >
          <Box display="flex" justifyContent="center">
            <Typography
              className={classes.logo}
              variant="h3"
              component="h1"
              color="secondary"
            >
              truck
            </Typography>
            <Typography className={classes.logo} variant="h4" component="h1">
              norris
            </Typography>
          </Box>

          <List className={classes.menu}>
            <ListItem
              className={classes.menuItem}
              key="Jokes"
              button
              component={RouterLink}
              onClick={() => setDrawerOpen(false)}
              to="/"
              selected={pathname === '/'}
            >
              <ListItemIcon className={classes.menuItemIcon}>
                <Dashboard fontSize="inherit" />
              </ListItemIcon>
              <ListItemText primary="Jokes" />
            </ListItem>
            <ListItem
              className={classes.menuItem}
              key="Random"
              button
              component={RouterLink}
              onClick={() => setDrawerOpen(false)}
              to="/random"
              selected={pathname === '/random'}
            >
              <ListItemIcon className={classes.menuItemIcon}>
                <Repeat fontSize="inherit" />
              </ListItemIcon>
              <ListItemText primary="Random" />
            </ListItem>
            <ListItem
              className={classes.menuItem}
              key="Favorites"
              button
              component={RouterLink}
              onClick={() => setDrawerOpen(false)}
              to="/favorites"
              selected={pathname === '/favorites'}
            >
              <ListItemIcon className={classes.menuItemIcon}>
                <Star fontSize="inherit" />
              </ListItemIcon>
              <ListItemText primary="Favorites" />
            </ListItem>
          </List>

          <Typography classes={{ root: classes.copyright }}>
            Coded with ❤️ by Geovani
          </Typography>
        </SwipeableDrawer>
      </Hidden>
    </>
  );
};

export default Navbar;
