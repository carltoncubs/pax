// JS libraries
import React, { Component } from "react";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import yellow from "@material-ui/core/colors/yellow";
import amber from "@material-ui/core/colors/";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import TextField from "@material-ui/core/TextField";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import {
  AutoCompleteTextBox,
  SignaturePadWrapper
} from "./CommonComponents.js";
import Header from "./Header.js";

// Images
// import csgLogo from "./csgLogo.png";

// CSS
import "./App.css";
import "materialize-css/dist/css/materialize.min.css";

const theme = createMuiTheme({
  palette: {
    primary: yellow,
    secondary: amber
  }
});

class Root extends Component {
  render() {
    return (
      <Redirect
        to={{
          pathname: "/sign-in",
          state: {
            from: this.props.location
          }
        }}
      />
    );
  }
}

class SignInForm extends Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <Header
          title="Sign In"
          user="Nicholas Spain"
          email="nicholas.spain96@gmail.com"
          auth
        />
        <div style={{ paddingTop: 20, paddingLeft: 200, paddingRight: 200 }}>
          <Grid container spacing={16}>
            <Grid item xs={12}>
              <Grid container justify="center">
                <TextField label="Cub Name" fullWidth />
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={20} justify="center">
                <Grid item xs={6} style={{ padding: 10 }}>
                  <SignaturePadWrapper label="Cub Sign In" />
                </Grid>

                <Grid item xs={6} style={{ padding: 10 }}>
                  <SignaturePadWrapper label="Parent Sign In" />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Grid container justify="center">
                <Button
                  variant="contained"
                  size="large"
                  className="submitButton"
                  color="primary"
                >
                  Submit
                  <Icon>send</Icon>
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </div>
      </MuiThemeProvider>
    );
  }
}

class SignOutForm extends Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <Header
          title="Sign Out"
          user="Nicholas Spain"
          email="nicholas.spain96@gmail.com"
          auth
        />
        <div style={{ paddingTop: 20, paddingLeft: 200, paddingRight: 200 }}>
          <Grid container spacing={16}>
            <Grid item xs={12}>
              <Grid container justify="center">
                <TextField label="Cub Name" fullWidth />
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={20} justify="center">
                <Grid item xs={12} style={{ padding: 10 }}>
                  <SignaturePadWrapper label="Parent Sign In" />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Grid container justify="center">
                <Button
                  variant="contained"
                  size="large"
                  className="submitButton"
                  color="primary"
                >
                  Submit
                  <Icon>send</Icon>
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </div>
      </MuiThemeProvider>
    );
  }
}

class Settings extends Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <Header
          title="Settings"
          user="Nicholas Spain"
          auth
          email="nicholas.spain96@gmail.com"
        />
        <div style={{ paddingTop: 50, paddingLeft: 100 }}>
          <form onSubmit={this.handleSubmit} noValidate autoComplate="off">
            <Grid container>
              <Grid item xs={12}>
                <TextField
                  id="spreadsheetId"
                  label="Spreadsheet ID"
                  variant="outlined"
                  margin="normal"
                />
              </Grid>
              <Grid item>
                <TextField
                  id="rollSheet"
                  label="Roll sheet"
                  variant="outlined"
                  margin="normal"
                />
              </Grid>
            </Grid>
            <Grid item>
              <Button variant="contained" size="large" color="primary">
                Save&nbsp;<Icon>save</Icon>
              </Button>
            </Grid>
          </form>
        </div>
      </MuiThemeProvider>
    );
  }
}

class Privacy extends Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <Header
          title="Privacy"
          user="Nicholas Spain"
          auth
          email="nicholas.spain96@gmail.com"
        />
        <div style={{ paddingTop: 50, paddingLeft: 100 }}>
          <h5>What information do we collect?</h5>
          <p>
            The only data collect is the cub's name, cub's signature, parent's
            signature (for sign in and sign out) and the sign in and out times.
            This is securely stored in a Google sheet only accessible by the Cub
            Leaders.
          </p>
          <h5>How do we use your information?</h5>
          <p>
            This information is used to ensure that we know who is picking up
            the cubs and to keep track of attendance.
          </p>
          <h5>What information do you share?</h5>
          <p>None of the information collected is shared.</p>
        </div>
      </MuiThemeProvider>
    );
  }
}

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Route path="/" exact component={Root} />
          <Route path="/sign-in" exact component={SignInForm} />
          <Route path="/sign-out" exact component={SignOutForm} />
          <Route path="/settings" exact component={Settings} />
          <Route path="/privacy" exact component={Privacy} />
        </div>
      </Router>
    );
  }
}

export default App;
