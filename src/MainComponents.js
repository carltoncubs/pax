// JS libraries
import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/styles";
import {
  // AutoCompleteTextBox,
  SignaturePadWrapper
} from "./CommonComponents.js";
import Header from "./Header.js";
import axios from "axios";

// Images
// import csgLogo from "./csgLogo.png";

// CSS
import "./App.css";
import "materialize-css/dist/css/materialize.min.css";

export class Root extends Component {
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

export class SignInForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cubName: "",
      cubSignature: "",
      parentSignature: ""
    };
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  handleSubmit = event => {
    event.preventDefault();
    const { enqueueSnackbar } = this.props;
    this.setState({
      cubSignature: this.cubSignaturePad.signaturePad.toDataURL(),
      parentSignature: this.parentSignaturePad.signaturePad.toDataURL()
    });
    let isValidForm = true;

    if (this.state.cubName.trim() === "") {
      isValidForm = false;
      enqueueSnackbar("Cub's name cannot be empty", { variant: "error" });
    }

    if (this.cubSignaturePad.signaturePad.isEmpty()) {
      isValidForm = false;
      enqueueSnackbar("Cub's signature cannot be empty", { variant: "error" });
    }

    if (this.parentSignaturePad.signaturePad.isEmpty()) {
      isValidForm = false;
      enqueueSnackbar("Parent's signature cannot be empty", {
        variant: "error"
      });
    }

    if (isValidForm) {
      const { cubName, cubSignature, parentSignature } = this.state;
      axios
        .post("/sign-in", { cubName, cubSignature, parentSignature })
        .then(result => {
          enqueueSnackbar(`${cubName} is signed in`, { variant: "success" });
        })
        .catch(err =>
          enqueueSnackbar(`There was a problem signing ${cubName} in`, {
            variant: "error"
          })
        );
    }
  };

  render() {
    return (
      <div>
        <Header
          title="Sign In"
          user="Nicholas Spain"
          email="nicholas.spain96@gmail.com"
          auth
        />
        <form
          style={{ paddingTop: 20, paddingLeft: 200, paddingRight: 200 }}
          onSubmit={this.handleSubmit}
          autoComplete="off"
          noValidate
        >
          <Grid container spacing={40}>
            <Grid item xs={12}>
              <Grid container justify="center">
                <TextField
                  id="cubName"
                  label="Cub Name"
                  onChange={this.handleChange("cubName")}
                  fullWidth
                />
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={16} justify="center">
                <Grid item xs={6} style={{ padding: 10 }}>
                  <SignaturePadWrapper
                    label="Cub Sign In"
                    ref={ref => (this.cubSignaturePad = ref)}
                  />
                </Grid>

                <Grid item xs={6} style={{ padding: 10 }}>
                  <SignaturePadWrapper
                    label="Parent Sign In"
                    ref={ref => (this.parentSignaturePad = ref)}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Grid container justify="center">
                <Button
                  type="submit"
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
        </form>
      </div>
    );
  }
}

export class SignOutForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cubName: "",
      parentSignature: ""
    };
  }

  handleSubmit = event => {
    event.preventDefault();
    this.setState({
      parentSignature: this.parentSignaturePad.signaturePad.toDataURL()
    });
    const { enqueueSnackbar } = this.props;
    const { cubName, parentSignature } = this.state;
    let isValidForm = true;

    if (cubName.trim() === "") {
      isValidForm = false;
      enqueueSnackbar("Cub name is required", { variant: "error" });
    }

    if (this.parentSignaturePad.signaturePad.isEmpty()) {
      isValidForm = false;
      enqueueSnackbar("Parent signature is required", { variant: "error" });
    }

    if (isValidForm) {
      axios
        .post("/sign-out", { cubName, parentSignature })
        .then(result => {
          enqueueSnackbar(`Successfully signed out ${cubName}`, {
            variant: "success"
          });
        })
        .catch(error =>
          enqueueSnackbar(`There was an error signing ${cubName} out`, {
            variant: "error"
          })
        );
    }
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  render() {
    return (
      <div>
        <Header
          title="Sign Out"
          user="Nicholas Spain"
          email="nicholas.spain96@gmail.com"
          auth
        />
        <form
          style={{ paddingTop: 20, paddingLeft: 200, paddingRight: 200 }}
          onSubmit={this.handleSubmit}
          autoComplete="off"
          noValidate
        >
          <Grid container spacing={40}>
            <Grid item xs={12}>
              <Grid container justify="center">
                <TextField
                  required
                  id="cubName"
                  label="Cub Name"
                  fullWidth
                  onChange={this.handleChange("cubName")}
                />
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Grid container justify="center">
                <Grid item xs={12} style={{ padding: 10 }}>
                  <SignaturePadWrapper
                    label="Parent Sign In"
                    ref={ref => (this.parentSignaturePad = ref)}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Grid container justify="center">
                <Button
                  type="submit"
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
        </form>
      </div>
    );
  }
}

export class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      spreadsheetId: this.props.spreadsheetId ? this.props.spreadsheetId : "",
      sheetName: this.props.sheetName ? this.rpops.sheetName : "",
      auxAutocompleteSheetName: this.props.auxAutocompleteSheetName
        ? this.props.auxAutocompleteSheetName
        : ""
    };
  }

  handleChange = fieldName => event => {
    this.setState({
      [fieldName]: event.target.value
    });
    console.log(`Updated state: ${JSON.stringify(this.state)}`);
  };

  handleSubmit = event => {
    event.preventDefault();
    const { enqueueSnackbar } = this.props;
    const { spreadsheetId, sheetName, auxAutocompleteSheetName } = this.state;
    let isValidForm = true;
    if (spreadsheetId.trim().length === 0) {
      enqueueSnackbar("Spreadsheet ID cannot be empty", { variant: "error" });
      isValidForm = false;
    }

    if (sheetName.trim().length === 0) {
      enqueueSnackbar("Roll sheet name cannot be empty", { variant: "error" });
      isValidForm = false;
    }

    if (isValidForm) {
      axios
        .post("/settings", {
          spreadsheetId,
          sheetName,
          auxAutocompleteSheetName
        })
        .then(result =>
          enqueueSnackbar("Saved settings", {
            variant: "success"
          })
        )
        .catch(err =>
          enqueueSnackbar("Failed to save settings...", {
            variant: "error"
          })
        );
    }
  };

  render() {
    const classes = makeStyles(theme => ({
      container: {
        display: "flex",
        flexWrap: "wrap"
      },
      textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit
      }
    }));
    return (
      <div>
        <Header
          title="Settings"
          user="Nicholas Spain"
          auth
          email="nicholas.spain96@gmail.com"
        />
        <div style={{ paddingTop: 50, paddingLeft: 100, paddingRight: 100 }}>
          <form
            noValidate
            autoComplete="off"
            onSubmit={this.handleSubmit}
            className={classes.container}
          >
            <Grid container spacing={40}>
              <Grid item xs={12}>
                <TextField
                  required
                  id="spreadsheetId"
                  label="Spreadsheet ID"
                  value={this.state.spreadsheetId}
                  margin="normal"
                  className={classes.textField}
                  fullWidth
                  onChange={this.handleChange("spreadsheetId")}
                  helperText={
                    <Typography variant="caption">
                      Spreadsheet ID as assigned by Google Drive. This is the
                      value between <code>/d/</code> and <code>/edit</code>. If
                      you pester the developer they might look into making this
                      the spreadsheet name.
                    </Typography>
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  id="sheetName"
                  value={this.state.sheetName}
                  className={classes.textField}
                  label="Roll sheet"
                  margin="normal"
                  onChange={this.handleChange("sheetName")}
                  fullWidth
                  helperText={
                    <Typography variant="caption">
                      Name of the sheet in which we will be keeing the
                      attendance record. This sheet should be within the
                      spreadsheet given above.
                    </Typography>
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="auxAutocompleteSheetName"
                  className={classes.textField}
                  label="Autocomplete helper sheet"
                  value={this.state.auxAutocompleteSheetName}
                  margin="normal"
                  fullWidth
                  onChange={this.handleChange("auxAutocompleteSheetName")}
                  helperText={
                    <Typography variant="caption">
                      Name of the sheet to help out name autocompletion. This
                      can be useful for adding new people have not been entered
                      into the attendance record yet
                    </Typography>
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  color="primary"
                >
                  Save&nbsp;<Icon>save</Icon>
                </Button>
              </Grid>
            </Grid>
          </form>
        </div>
      </div>
    );
  }
}

export class Privacy extends Component {
  render() {
    return (
      <div>
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
      </div>
    );
  }
}

// export withSnackbar(SignInForm);
// export withSnackbar(SignOutForm);
// export withSnackbar(Settings);
