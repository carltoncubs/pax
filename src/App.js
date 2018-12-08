import moment from "moment";
import React, { Component } from "react";
import { GoogleLogin } from "react-google-login";

import Privacy from "./Privacy";
import Root from "./Root";
import Settings from "./Settings";
import SignInForm from "./SignInForm";
import SignOutForm from "./SignOutForm";
import config from "./config.json";
import { BrowserRouter as Router, Route } from "react-router-dom";

export default class App extends Component {
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

  onSignInSubmit = ctx => event => {
    event.preventDefault();
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

    if (isValidForm) {
      const { cubName } = ctx.state;
      const cubSignature = ctx.cubSignaturePad.signaturePad.toDataURL();
      const parentSignature = ctx.parentSignaturePad.signaturePad.toDataURL();
      const timestamp = moment().format("HH:MM:SS ");
      const date = moment().format("YYYY-MM-DD");
      const body = JSON.stringify({
        cubName,
        cubSignature,
        parentSignature,
        timestamp,
        date
      });

      const options = {
        method: "POST",
        body: body,
        headers: {
          Authorization: `Bearer ${ctx.props.token}`
        },
        mode: "cors",
        cache: "default"
      };

      fetch(`${config.API_URL}/v1/sign-in`, options)
        .then(resp => {
          enqueueSnackbar(`${cubName} is signed in`, { variant: "success" });
          ctx.setState({
            cubName: "",
            cubSignature: "",
            parentSignature: ""
          });
          ctx.cubSignaturePad.signaturePad.clear();
          ctx.parentSignaturePad.signaturePad.clear();
        })
        .catch(err => {
          console.log(err);
          enqueueSnackbar(`There was a problem signing ${cubName} in`, {
            variant: "error"
          });
        });
    }
  };

  onSignOutSubmit = ctx => event => {
    event.preventDefault();
    ctx.setState({
      parentSignature: ctx.parentSignaturePad.signaturePad.toDataURL()
    });
    const { enqueueSnackbar } = ctx.props;
    const { cubName, parentSignature } = ctx.state;
    let isValidForm = true;

    if (cubName.trim() === "") {
      isValidForm = false;
      enqueueSnackbar("Cub name is required", { variant: "error" });
    }

    if (ctx.parentSignaturePad.signaturePad.isEmpty()) {
      isValidForm = false;
      enqueueSnackbar("Parent signature is required", { variant: "error" });
    }

    if (isValidForm) {
      const body = {
        cubName: cubName,
        parentSignature: parentSignature
      };

      const options = {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          Authorization: `Bearer ${ctx.props.token}`
        },
        mode: "cors",
        cache: "default"
      };

      fetch(`${config.API_URL}/v1/sign-out`, options)
        .then(resp => {
          console.log(resp);
          enqueueSnackbar(`${cubName} is signed out`, { variant: "success" });
          ctx.setState({
            cubName: "",
            parentSignature: ""
          });
          ctx.parentSignaturePad.signaturePad.clear();
        })
        .catch(err => {
          console.log(err);
          enqueueSnackbar(`There was a problem signing ${cubName} out`, {
            variant: "error"
          });
        });
    }
  };

  onSettingsSubmit = ctx => event => {
    event.preventDefault();
    const { enqueueSnackbar } = ctx.props;
    const { spreadsheetId, attendanceSheet, autocompleteSheet } = ctx.state;
    let isValidForm = true;
    if (spreadsheetId.trim().length === 0) {
      enqueueSnackbar("Spreadsheet ID cannot be empty", { variant: "error" });
      isValidForm = false;
    }

    if (attendanceSheet.trim().length === 0) {
      enqueueSnackbar("Roll sheet name cannot be empty", { variant: "error" });
      isValidForm = false;
    }

    if (isValidForm) {
      const body = {
        spreadsheetId,
        attendanceSheet,
        autocompleteSheet
      };

      const options = {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          Authorization: `Bearer ${ctx.props.token}`
        },
        mode: "cors",
        cache: "default"
      };

      fetch(`${config.API_URL}/v1/settings`, options)
        .then(result => {
          if (result.ok) {
            enqueueSnackbar("Saved settings", {
              variant: "success"
            });
          } else {
            enqueueSnackbar("There was problem saving the settings", {
              variant: "error"
            });
          }
        })
        .catch(err =>
          enqueueSnackbar("There was a problem saving the settings", {
            variant: "error"
          })
        );
    }
  };

  settingsGetter = ctx => () => {
    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${this.props.token}`
      },
      mode: "cors",
      cache: "default"
    };

    fetch(`${config.API_URL}/v1/settings`, options)
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
              console.log(error);
              enqueueSnackbar(
                "There was a problem getting the previously saved settings",
                { variant: "error" }
              );
            });
        }
      })
      .catch(err => {
        console.log(err);
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
                  onSubmit={this.onSignInSubmit}
                  autocompletion={this.autocompletion}
                  email={this.state.user.email}
                  name={this.state.user.name}
                  token={this.state.token}
                />
              )}
            />
            <Route
              path="/sign-out"
              exact
              render={props => (
                <SignOutForm
                  {...props}
                  onSubmit={this.onSignOutSubmit}
                  autocompletion={this.autocompletion}
                  email={this.state.user.email}
                  name={this.state.user.name}
                  token={this.state.token}
                />
              )}
            />
            <Route
              path="/settings"
              exact
              render={props => (
                <Settings
                  {...props}
                  onSubmit={this.onSettingsSubmit}
                  settingsGetter={this.settingsGetter}
                  email={this.state.user.email}
                  name={this.state.user.name}
                  token={this.state.token}
                />
              )}
            />
            <Route path="/privacy" exact component={Privacy} />
          </div>
        </Router>
      );
    } else {
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
}
