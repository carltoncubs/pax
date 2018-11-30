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
import { GoogleLogin } from "react-google-login";
import config from "./config.json";

const theme = createMuiTheme({
  palette: {
    primary: yellow,
    secondary: amber
  }
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthenticated: false,
      user: null,
      token: ""
    };
  }

  logout = () => {
    this.setState({
      isAuthenticated: false,
      token: "",
      user: null
    });
  };

  onFailure = err => {
    console.log(err);
  };

  googleResponse = resp => {
    console.log(resp);
    const tokenBlob = new Blob(
      [JSON.stringify({ access_token: resp.accessToken }, null, 2)],
      { type: "application/json" }
    );

    const options = {
      method: "POST",
      body: tokenBlob,
      mode: "cors",
      cache: "default"
    };

    fetch("http://localhost:8000/v1/auth/google", options)
      .then(r => {
        if (r.ok) {
          r.json().then(json => {
            if (json.token) {
              this.setState({
                isAuthenticated: true,
                user: json.token
              });
            }
          });
        }
      })
      .catch(err => console.log(err));
  };

  render() {
    if (!!this.state.isAuthenticated) {
      return (
        <Router>
          <div>
            <Route path="/" exact component={Root} />
            <Route path="/sign-in" exact component={withSnackbar(SignInForm)} />
            <Route
              path="/sign-out"
              exact
              component={withSnackbar(SignOutForm)}
            />
            <Route path="/settings" exact component={withSnackbar(Settings)} />
            <Route path="/privacy" exact component={Privacy} />
          </div>
        </Router>
      );
    }
    const clientId = config.GOOGLE_CLIENT_ID;
    const success = this.googleResponse;
    const error = this.onFailure;
    const loading = () => console.log("Loading...");
    return (
      <GoogleLogin
        clientId={clientId}
        onSuccess={success}
        onFailure={error}
        onRequest={loading}
        offline={false}
        approvalPrompt="force"
        responseType="id_token"
        isSignedIn
        theme="dark"
      />
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
