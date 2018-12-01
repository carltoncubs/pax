import amber from "@material-ui/core/colors/";
import { SnackbarProvider, withSnackbar } from "notistack";
import React, { Component } from "react";
import ReactDOM from "react-dom";
import { GoogleLogin } from "react-google-login";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import yellow from "@material-ui/core/colors/yellow";

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
      user: {
        email: "",
        name: ""
      }
    });
  };

  onFailure = err => {
    console.log(err);
  };

  googleResponse = googleResp => {
    const tokenBlob = new Blob(
      [JSON.stringify({ access_token: googleResp.accessToken }, null, 2)],
      { type: "application/json" }
    );

    const options = {
      method: "POST",
      body: tokenBlob,
      mode: "cors",
      cache: "default"
    };

    fetch(`${config.API_URL}/v1/auth/google`, options)
      .then(authResp => {
        if (authResp.ok) {
          authResp.json().then(json => {
            if (json.token) {
              const { email, name } = googleResp.profileObj;
              this.setState({
                isAuthenticated: true,
                token: json.token,
                user: { email, name }
              });
            }
          });
        }
      })
      .catch(err => console.log(err));
  };

  render() {
    if (!!this.state.isAuthenticated) {
      console.log("User is authorised");
      return (
        <Router>
          <div>
            <Route path="/" exact render={props => <Root {...props} />} />
            <Route
              path="/sign-in"
              exact
              render={props => (
                <SignInForm
                  {...props}
                  email={this.state.user.email}
                  name={this.state.user.name}
                  token={this.state.token}
                />
              )}
            />
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
    return (
      <GoogleLogin
        clientId={clientId}
        onSuccess={success}
        onFailure={error}
        offline={false}
        approvalPrompt="force"
        responseType="id_token"
        isSignedIn
        theme="dark"
        uxMode="redirect"
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
