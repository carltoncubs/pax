// JS libraries
import React, { Component } from "react";
import { Redirect } from "react-router-dom";

class Root extends Component {
  render() {
    return (
      <Redirect
        to={{
          pathname: "/sign-in",
          state: {
            from: this.props.location
          }
        }}
      />
    );
  }
}

export default Root
