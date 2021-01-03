import { createMuiTheme } from '@material-ui/core/styles';

const colors = {
  primary: {
    light: '#2EB594',
    main: '#00A578',
    dark: '#00694B',
  },
  red: {
    default: '#DD0000',
  },
  white: {
    default: '#FCFCFC',
  },
  black: {
    default: '#292929',
  },
  gray: {
    light: '#B6B7B9',
    medium: '#6D6F74',
    dark: '#37383D',
  },
};

// Create a theme instance.
const theme = createMuiTheme({
  props: {
    MuiButtonBase: {
      disableRipple: true,
    },
    MuiTabs: {
      textColor: 'primary',
      indicatorColor: 'primary',
    },
    MuiCheckbox: {
      color: 'primary',
    },
    MuiRadio: {
      color: 'primary',
    },
  },
  palette: {
    primary: {
      light: colors.primary.light,
      main: colors.primary.main,
      dark: colors.primary.dark,
    },
    secondary: { main: colors.red.default },
    background: {
      // default: colors.white.default,
      default: '#FCFBF8',
    },
    text: {
      primary: colors.black.default,
    },
  },
  overrides: {
    MuiCssBaseline: {
      '@global': {
        html: {
          WebkitFontSmoothing: 'auto',
          height: '100%',
          backgroundColor: colors.white.default,
        },
        body: {
          height: '100%',
        },
        '#root': {
          height: '100%',
        },
      },
    },
    MuiTypography: {
      h1: {
        fontSize: '4.5rem',
        fontWeight: 700,
      },
      h2: {
        fontSize: '3.25rem',
        fontWeight: 700,
      },
      h3: {
        fontSize: '2.0rem',
        fontWeight: 700,
      },
      body2: {
        fontSize: '0.9rem',
      },
    },
    MuiInputLabel: {
      root: {
        fontSize: '1rem',
        textTransform: 'uppercase',
        color: colors.black.default,
      },
    },
    MuiCheckbox: {
      root: {
        padding: '0.125rem 0.5625rem',
        '&&:hover,&&$checked:hover': {
          backgroundColor: 'transparent',
        },
      },
    },
    MuiRadio: {
      root: {
        padding: '0.125rem 0.5625rem',
        '&:hover': {
          backgroundColor: 'transparent',
        },
      },
    },
    MuiOutlinedInput: {
      adornedEnd: {
        '&$marginDense': {
          paddingRight: 0,
        },
      },
      input: {
        padding: '0.75rem 0.5rem',
      },
    },
  },
  typography: {
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      'Arial',
      '-apple-system',
      '"Helvetica Neue"',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    fontWeightBold: 700,
  },
});

export default theme;
