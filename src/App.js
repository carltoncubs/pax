import moment from "moment";
import React, { Component } from "react";
import { GoogleLogin } from "react-google-login";

import Privacy from "./Privacy";
import Root from "./Root";
import Settings from "./Settings";
import SignInForm from "./SignInForm";
import SignOutForm from "./SignOutForm";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { withSnackbar } from "notistack";
import axios from "axios";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthenticated: false,
      user: {
        email: "",
        name: ""
      },
      token: !!this.props.token ? this.props.token : ""
    };

    this.API_URL = process.env.REACT_APP_API_URL;
    this.GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    this.DISABLE_AUTH = process.env.REACT_APP_DISABLE_AUTH;
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
    console.error(err);
  };

  googleResponse = googleResp => {
    const tokenBlob = new Blob(
      [
        JSON.stringify(
          { accessToken: googleResp.accessToken, user: googleResp.profileObj },
          null,
          2
        )
      ],
      { type: "application/json" }
    );

    const options = {
      method: "POST",
      body: tokenBlob,
      mode: "cors",
      cache: "default"
    };

    return fetch(`${this.API_URL}/v1/auth/google`, options)
      .then(authResp => authResp.json())
      .then(json => {
        if (json.token) {
          const { email, name } = googleResp.profileObj;
          this.setState({
            isAuthenticated: true,
            token: json.token,
            user: { email, name }
          });
          sessionStorage.setItem("token", json.token);
        }
        return this.state.isAuthenticated;
      });
  };

  signInValidator = ctx => () => {
    const { enqueueSnackbar } = ctx.props;
    let isValidForm = true;

    if (ctx.state.cubName.trim() === "") {
      isValidForm = false;
      enqueueSnackbar("Cub's name cannot be empty", { variant: "error" });
    }

    if (ctx.cubSignaturePad.signaturePad.isEmpty()) {
      isValidForm = false;
      enqueueSnackbar("Cub's signature cannot be empty", { variant: "error" });
    }

    if (ctx.parentSignaturePad.signaturePad.isEmpty()) {
      isValidForm = false;
      enqueueSnackbar("Parent's signature cannot be empty", {
        variant: "error"
      });
    }

    return isValidForm;
  };

  signOutValidator = ctx => () => {
    const { enqueueSnackbar } = ctx.props;
    let isValidForm = true;

    if (ctx.state.cubName.trim() === "") {
      isValidForm = false;
      enqueueSnackbar("Cub name is required", { variant: "error" });
    }

    if (ctx.parentSignaturePad.signaturePad.isEmpty()) {
      isValidForm = false;
      enqueueSnackbar("Parent signature is required", { variant: "error" });
    }

    return isValidForm;
  };

  settingsValidator = ctx => () => {
    const { enqueueSnackbar } = ctx.props;
    const { spreadsheetId, attendanceSheet } = ctx.state;
    let isValidForm = true;
    if (spreadsheetId.trim().length === 0) {
      enqueueSnackbar("Spreadsheet ID cannot be empty", { variant: "error" });
      isValidForm = false;
    }

    if (attendanceSheet.trim().length === 0) {
      enqueueSnackbar("Roll sheet name cannot be empty", { variant: "error" });
      isValidForm = false;
    }

    return isValidForm;
  };

  submitter = baseURL => token => endpoint => ctx => data => successMsg => errorMsg => {
    const { enqueueSnackbar } = ctx.props;
    data.timestamp = moment().format("HH:MM:SS");
    data.date = moment().format("YYYY-MM-DD");

    const instance = axios.create({
      baseURL: `${baseURL}/v1/`,
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    instance
      .post(`${endpoint}`, data)
      .then(resp => {
        enqueueSnackbar(successMsg, {
          variant: "success"
        });
      })
      .catch(error => {
        console.error(error);
        enqueueSnackbar(errorMsg, {
          variant: "error"
        });
      });
  };

  settingsGetter = ctx => () => {
    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${this.state.token}`
      },
      mode: "cors",
      cache: "default"
    };

    fetch(`${this.API_URL}/v1/settings`, options)
      .then(resp => {
        if (resp.ok) {
          const { enqueueSnackbar } = this.props;
          resp
            .json()
            .then(json => {
              this.setState({
                spreadsheetId: json.spreadsheetId ? json.spreadsheetId : "",
                attendanceSheet: json.attendanceSheet
                  ? json.attendanceSheet
                  : "",
                autocompleteSheet: json.autocompleteSheet
                  ? json.autocompleteSheet
                  : ""
              });
            })
            .catch(error => {
              console.error(error);
              enqueueSnackbar(
                "There was a problem getting the previously saved settings",
                { variant: "error" }
              );
            });
        }
      })
      .catch(err => {
        console.error(err);
        const { enqueueSnackbar } = this.props;
        enqueueSnackbar(
          "There was a problem getting the previously saved settings",
          { variant: "error" }
        );
      });
  };

  autocompletion = () => {
    return [];
  };

  onGoogleLogout = () => {
    this.setState({
      isAuthenticated: false,
      user: {
        email: "",
        name: ""
      },
      token: ""
    });
  };

  componentDidMount() {
    const token = sessionStorage.getItem("token");
    if (!!token) {
      this.setState({
        token: token
      });
    }
  }

  render() {
    const submitter = this.submitter(this.API_URL)(this.state.token);

    const signInSubmitter = submitter("sign-in");
    const signOutSubmitter = submitter("sign-out");
    const settingsSubmitter = submitter("settings");
    const clientId = this.GOOGLE_CLIENT_ID;
    const success = this.googleResponse;
    const error = this.onFailure;
    const onLogout = this.onGoogleLogout;

    const SignInFormWithSnackbar = withSnackbar(SignInForm);
    const SignOutFormWithSnackbar = withSnackbar(SignOutForm);
    const SettingsWithSnackbar = withSnackbar(Settings);
    if (this.state.token || this.DISABLE_AUTH) {
      return (
        <Router>
          <div>
            <Route path="/" exact render={props => <Root {...props} />} />
            <Route
              path="/sign-in"
              exact
              render={props => (
                <SignInFormWithSnackbar
                  {...props}
                  validator={this.signInValidator}
                  submitter={signInSubmitter}
                  autocompletion={this.autocompletion}
                  email={this.state.user.email}
                  name={this.state.user.name}
                  token={this.state.token}
                  onLogout={onLogout}
                />
              )}
            />
            <Route
              path="/sign-out"
              exact
              render={props => (
                <SignOutFormWithSnackbar
                  {...props}
                  validator={this.signOutValidator}
                  submitter={signOutSubmitter}
                  autocompletion={this.autocompletion}
                  email={this.state.user.email}
                  name={this.state.user.name}
                  token={this.state.token}
                  onLogout={resp => console.log(resp)}
                />
              )}
            />
            <Route
              path="/settings"
              exact
              render={props => (
                <SettingsWithSnackbar
                  {...props}
                  validator={this.settingsValidator}
                  submitter={settingsSubmitter}
                  settingsGetter={this.settingsGetter}
                  email={this.state.user.email}
                  name={this.state.user.name}
                  token={this.state.token}
                  onLogout={resp => console.log(resp)}
                />
              )}
            />
            <Route path="/privacy" exact component={Privacy} />
          </div>
        </Router>
      );
    }
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

export default withSnackbar(App);
