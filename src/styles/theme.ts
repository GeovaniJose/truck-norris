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
    fontSize: 16,
  },
  overrides: {
    MuiCssBaseline: {
      '@global': {
        html: {
          WebkitFontSmoothing: 'antialiased',
        },
      },
    },
  },
});

const responsiveTheme = responsiveFontSizes(theme);

export default responsiveTheme;
