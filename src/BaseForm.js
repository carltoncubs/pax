import React, { Component } from "react";
import Header from "./Header.js";

export default class BaseForm extends Component {
  render() {
    return (
      <div>
        <Header
          title={this.props.title}
          user={this.props.name}
          email={this.props.email}
          auth={this.props.auth}
          onLogout={this.props.onLogout}
        />

        <form
          style={{ paddingTop: 20, paddingLeft: 200, paddingRight: 200 }}
          autoComplete={this.props.autocomplete}
          noValidate={this.noValidate}
          onSubmit={this.props.onSubmit}
        >
          {this.props.children}
        </form>
      </div>
    );
  }
}
