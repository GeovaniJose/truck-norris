import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#275160',
    },
    secondary: {
      main: '#46f7a8',
    },
    success: {
      main: '#4bb543',
    },
    error: {
      main: '#c53030',
    },
    background: {
      default: '#fff',
    },
  },
  typography: {
    fontSize: 14,
  },
  overrides: {
    MuiCssBaseline: {
      '@global': {
        html: {
          WebkitFontSmoothing: 'antialiased',
        },
        '#root': {
          height: '100vh',
          display: 'flex',
        },
      },
    },
  },
});

const responsiveTheme = responsiveFontSizes(theme);

export default responsiveTheme;
