import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Icon from "@material-ui/core/Icon";
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
    this.validator = this.props.validator(this);
    this.submitter = this.props.submitter;
    this.autocompletion = this.props.autocompletion;
  }

  componentDidMount() {
    const opts = this.autocompletion();
    this.setState({
      nameOptions: opts
    });
  }

  onSubmit = event => {
    event.preventDefault();
    if (this.validator()) {
      const { cubName, parentSignature } = this.state;
      this.submitter("sign-in", {
        cubName: cubName,
        parentSignature: parentSignature
      });
    }
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  render() {
    return (
      <BaseForm
        title="Sign Out"
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

export default SignOutForm;
