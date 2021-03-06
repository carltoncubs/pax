import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Icon from "@material-ui/core/Icon";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import React, { Component } from "react";
import { makeStyles } from "@material-ui/styles";

import BaseForm from "./BaseForm";

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      spreadsheetId: "",
      attendanceSheet: "",
      autocompleteSheet: ""
    };
    this.validator = this.props.validator(this);
    this.submitter = this.props.submitter(this);
    this.settingsGetter = this.props.settingsGetter(this);
  }

  componentDidMount() {
    this.settingsGetter();
    document.title = `${document.title} - Settings`;
  }

  onSubmit = event => {
    event.preventDefault();
    if (this.validator()) {
      const { spreadsheetId, attendanceSheet, autocompleteSheet } = this.state;
      this.submitter({
        spreadsheetId: spreadsheetId,
        attendanceSheet: attendanceSheet,
        autocompleteSheet: autocompleteSheet
      })("Settings submitter")("There was a problem submitting the settings");
    }
  };

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
      <BaseForm
        title="Settings"
        name={this.props.name}
        email={this.props.email}
        onSubmit={this.onSubmit}
        onLogout={this.props.onLogout}
        autoComplete="off"
        noValidate
        auth
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
                  Spreadsheet ID as assigned by Google Drive. This is the value
                  between <code>/d/</code> and <code>/edit</code>. If you pester
                  the developer they might look into making this the spreadsheet
                  name.
                </Typography>
              }
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              id="attendanceSheet"
              value={this.state.attendanceSheet}
              className={classes.textField}
              label="Attendance sheet"
              margin="normal"
              onChange={this.handleChange("attendanceSheet")}
              fullWidth
              helperText={
                <Typography variant="caption">
                  Name of the sheet in which we will be keeing the attendance
                  record. This sheet should be within the spreadsheet given
                  above.
                </Typography>
              }
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="autocompleteSheet"
              className={classes.textField}
              label="Autocomplete helper sheet"
              value={this.state.autocompleteSheet}
              margin="normal"
              fullWidth
              onChange={this.handleChange("autocompleteSheet")}
              helperText={
                <Typography variant="caption">
                  Name of the sheet to help out name autocompletion. This can be
                  useful for adding new people have not been entered into the
                  attendance record yet
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
      </BaseForm>
    );
  }
}

export default Settings;
