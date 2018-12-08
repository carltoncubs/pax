import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Icon from "@material-ui/core/Icon";
import { withSnackbar } from "notistack";
import React, { Component } from "react";

import {
  SignaturePadWrapper,
  AutoCompleteTextBox
} from "./CommonComponents.js";
import Header from "./Header.js";
import config from "./config.json";

class SignOutForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cubName: "",
      parentSignature: ""
    };
    this.onSubmit = this.props.onSubmit(this);
  }

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
          onSubmit={this.onSubmit}
          autoComplete="off"
          noValidate
        >
          <Grid container spacing={40}>
            <Grid item xs={12}>
              <Grid container justify="center">
                <AutoCompleteTextBox
                  required
                  id="cubName"
                  label="Cub Name"
                  fullWidth
                  value={this.state.cubName}
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

export default withSnackbar(SignOutForm);
