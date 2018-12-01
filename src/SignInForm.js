import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Icon from "@material-ui/core/Icon";
import TextField from "@material-ui/core/TextField";
import { withSnackbar } from "notistack";
import React, { Component } from "react";

import { SignaturePadWrapper } from "./CommonComponents.js";
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
      const body = new Blob(
        [JSON.stringify({ cubName, cubSignature, parentSignature })],
        { type: "application/json" }
      );
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
          console.log(resp);
          enqueueSnackbar(`${cubName} is signed in`, { variant: "success" });
        })
        .catch(err => {
          console.log(err);
          enqueueSnackbar(`There was a problem signing ${cubName} in`, {
            variant: "error"
          });
        });
    }
  };

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

export default withSnackbar(SignInForm);
