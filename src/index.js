import amber from "@material-ui/core/colors/";
import { SnackbarProvider } from "notistack";
import React, { Component } from "react";
import ReactDOM from "react-dom";
import { GoogleLogin } from "react-google-login";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import yellow from "@material-ui/core/colors/yellow";
import "typeface-roboto";

import App from "./App";
import Privacy from "./Privacy";
import Root from "./Root";
import Settings from "./Settings";
import SignInForm from "./SignInForm";
import SignOutForm from "./SignOutForm";
import config from "./config.json";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter as Router, Route } from "react-router-dom";

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
    <SnackbarProvider maxSnack={10}>
      <App />
    </SnackbarProvider>
  </MuiThemeProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
