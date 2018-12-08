import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Icon from "@material-ui/core/Icon";
import { withSnackbar } from "notistack";
import React, { Component } from "react";

import BaseForm from "./BaseForm";
import {
  AutoCompleteTextBox,
  SignaturePadWrapper
} from "./CommonComponents.js";

class SignOutForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cubName: "",
      parentSignature: "",
      nameOptions: []
    };
    this.onSubmit = this.props.onSubmit(this);
    this.autocompletion = this.props.autocompletion;
  }

  componentDidMount() {
    const opts = this.autocompletion();
    this.setState({
      nameOptions: opts
    });
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  render() {
    return (
      <BaseForm
        title="Sign Out"
        user={this.props.name}
        email={this.props.email}
        onSubmit={this.onSubmit}
        autoComplete="off"
        noValidate
        auth
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
      </BaseForm>
    );
  }
}

export default withSnackbar(SignOutForm);
