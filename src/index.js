import React, { Component } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import { SnackbarProvider, withSnackbar } from "notistack";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import yellow from "@material-ui/core/colors/yellow";
import amber from "@material-ui/core/colors/";
import { BrowserRouter as Router, Route } from "react-router-dom";
import {
  Root,
  SignInForm,
  SignOutForm,
  Settings,
  Privacy
} from "./MainComponents.js";

const theme = createMuiTheme({
  palette: {
    primary: yellow,
    secondary: amber
  }
});

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Route path="/" exact component={Root} />
          <Route path="/sign-in" exact component={withSnackbar(SignInForm)} />
          <Route path="/sign-out" exact component={withSnackbar(SignOutForm)} />
          <Route path="/settings" exact component={withSnackbar(Settings)} />
          <Route path="/privacy" exact component={Privacy} />
        </div>
      </Router>
    );
  }
}

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
