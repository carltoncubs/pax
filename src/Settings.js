import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Icon from "@material-ui/core/Icon";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { withSnackbar } from "notistack";
import React, { Component } from "react";
import { makeStyles } from "@material-ui/styles";

import Header from "./Header.js";
import config from "./config.json";

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      spreadsheetId: "",
      attendanceSheet: "",
      autocompleteSheet: ""
    };
    this.onSubmit = this.props.onSubmit(this);
  }

  componentDidMount() {
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
  }

  handleChange = fieldName => event => {
    this.setState({
      [fieldName]: event.target.value
    });
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
                  value={this.state.attendanceSheet}
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
                  value={this.state.autocompleteSheet}
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

export default withSnackbar(Settings);
