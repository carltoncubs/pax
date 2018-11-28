import React, { Component } from "react";
import { TemporaryDrawer } from "./TemporaryDrawer.js";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import SignaturePad from "react-signature-pad-wrapper";
import Paper from "@material-ui/core/Paper";
import AppBar from "@material-ui/core/AppBar";
import Typography from "@material-ui/core/Typography";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import AccountCircle from "@material-ui/icons/AccountCircle";
import Email from "@material-ui/icons/Email";
import Person from "@material-ui/icons/Person";
import Popover from "@material-ui/core/Popover";
import MenuItem from "@material-ui/core/MenuItem";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { styled } from "@material-ui/styles";

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
        <SignaturePad options={{ backgroundColor: "rgb(255,255,255)" }} />
      </div>
    );
  }
}
