import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Icon from "@material-ui/core/Icon";
import moment from "moment";
import { withSnackbar } from "notistack";
import React, { Component } from "react";

import {
  AutoCompleteTextBox,
  SignaturePadWrapper
} from "./CommonComponents.js";
import Header from "./Header.js";
import config from "./config.json";

class SignInForm extends Component {
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
      const { cubName } = this.state;
      const cubSignature = this.cubSignaturePad.signaturePad.toDataURL();
      const parentSignature = this.parentSignaturePad.signaturePad.toDataURL();
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
          Authorization: `Bearer ${this.props.token}`
        },
        mode: "cors",
        cache: "default"
      };

      fetch(`${config.API_URL}/v1/sign-in`, options)
        .then(resp => {
          enqueueSnackbar(`${cubName} is signed in`, { variant: "success" });
          this.setState({
            cubName: "",
            cubSignature: "",
            parentSignature: ""
          });
          this.cubSignaturePad.signaturePad.clear();
          this.parentSignaturePad.signaturePad.clear();
        })
        .catch(err => {
          console.log(err);
          enqueueSnackbar(`There was a problem signing ${cubName} in`, {
            variant: "error"
          });
        });
    }
  };

  onComponentDidUpdate() {
    console.log("updating...");
    this.cubSignaturePad.signaturePad.fromDataURL(this.state.cubSignature);
    this.parentSignaturePad.signaturePad.fromDataURL(
      this.state.parentSignature
    );
  }

  render() {
    return (
      <div>
        <Header
          title="Sign In"
          user={this.props.name}
          email={this.props.email}
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
                <AutoCompleteTextBox
                  id="cubName"
                  label="Cub Name"
                  onChange={this.handleChange("cubName")}
                  fullWidth
                  value={this.state.cubName}
                />
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={16} justify="center">
                <Grid item xs={6} style={{ padding: 10 }}>
                  <SignaturePadWrapper
                    label="Cub Sign In"
                    ref={ref => (this.cubSignaturePad = ref)}
                    contents={this.state.cubSignature}
                  />
                </Grid>

                <Grid item xs={6} style={{ padding: 10 }}>
                  <SignaturePadWrapper
                    label="Parent Sign In"
                    ref={ref => (this.parentSignaturePad = ref)}
                    contents={this.state.parentSignature}
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

export default withSnackbar(SignInForm);
