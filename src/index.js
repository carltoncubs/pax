import amber from "@material-ui/core/colors/";
import { SnackbarProvider } from "notistack";
import React from "react";
import ReactDOM from "react-dom";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import yellow from "@material-ui/core/colors/yellow";
import "typeface-roboto";
import Button from "@material-ui/core/Button";

import App from "./App";
import * as serviceWorker from "./serviceWorker";

import "./App.css";

const theme = createMuiTheme({
  typography: {
    useNextVariants: true
  },
  palette: {
    primary: yellow,
    secondary: amber
  }
});

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <SnackbarProvider
      maxSnack={10}
      action={[<Button size="small">Dismiss</Button>]}
      classes={{
        variantError: "error-notification",
        variantSuccess: "success-notification"
      }}
    >
      <App />
    </SnackbarProvider>
  </MuiThemeProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
