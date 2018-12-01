import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Icon from "@material-ui/core/Icon";
import TextField from "@material-ui/core/TextField";
import { withSnackbar } from "notistack";
import React, { Component } from "react";

import { SignaturePadWrapper } from "./CommonComponents.js";
import Header from "./Header.js";
import config from "./config.json";

class SignOutForm extends Component {
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
      const body = {
        cubName: cubName,
        parentSignature: parentSignature
      };

      const options = {
        method: "POST",
        body: body,
        headers: {
          Authorization: `Bearer ${this.props.token}`
        },
        mode: "cors",
        cache: "default"
      };

      fetch(`${config.API_URL}/v1/sign-out`, options)
        .then(resp => {
          console.log(resp);
          enqueueSnackbar(`${cubName} is signed out`, { variant: "success" });
        })
        .catch(err => {
          console.log(err);
          enqueueSnackbar(`There was a problem signing ${cubName} out`, {
            variant: "error"
          });
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

export default withSnackbar(SignOutForm);
