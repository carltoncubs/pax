import React, { Component } from "react";
import TextField from "@material-ui/core/TextField";
import SignaturePad from "react-signature-pad-wrapper";

export class AutoCompleteTextBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      options: this.props.options ? this.props.options : []
    };
  }

  render() {
    return <TextField label={this.props.label} />;
  }
}

export class SignaturePadWrapper extends Component {
  render() {
    return (
      <div className="signaturePad">
        <SignaturePad
          options={{ backgroundColor: "rgb(255,255,255)" }}
          ref={ref => (this.signaturePad = ref)}
        />
      </div>
    );
  }
}
