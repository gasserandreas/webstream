import { createMuiTheme } from "@material-ui/core/styles";

// Create a theme instance.
const theme = createMuiTheme({
  overrides: {
    MuiCssBaseline: {
      "@global": {
        html: {
          WebkitFontSmoothing: "auto",
          height: "100%",
        },
        body: {
          height: "100%",
        },
        "#root": {
          height: "100%",
        },
      },
    },
  },
});

export default theme;
