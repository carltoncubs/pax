// JS libraries
import React, { Component } from "react";
import { pushRotate as Menu } from "react-burger-menu";
import SignaturePad from "react-signature-pad-wrapper";
import {
  BrowserRouter as Router,
  Route,
  NavLink,
  Link,
  Redirect,
} from "react-router-dom";
import Select from "react-select";
import M from "materialize-css";

// Images
import csgLogo from "./csgLogo.png";

// CSS
import "./App.css";
import "materialize-css/dist/css/materialize.min.css";

class Header extends Component {
  render() {
    const menu = [
      ["Sign In", "/sign-in"],
      ["Sign Out", "/sign-out"],
      ["Settings", "/settings"],
      ["Privacy", "/privacy"],
    ];
    return (
      <header className="App-header">
        <nav>
          <div className="nav-wrapper">
            <a href="#!" className="brand-logo">
              {this.props.title}
            </a>
            <a href="#" className="sidenav-trigger">
              <i className="material-icons">menu</i>
            </a>
            <ul className="right hide-on-med-and-down">
              {menu.map(link => (
                <li>
                  <a href={link[1]}>{link[0]}</a>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        <ul className="sidenav" id="mobile-demo">
          {menu.map(link => (
            <Link to={link[1]}>{link[0]}</Link>
          ))}
        </ul>

        {/* <div className="row"> */}
        {/*   <nav> */}
        {/*     <div className="nav-wrapper"> */}
        {/*       <a href="#!" className="brand-logo"> */}
        {/*         {this.props.title} */}
        {/*       </a> */}
        {/*       <a href="#" className="sidenav-trigger"> */}
        {/*         <i className="material-icons">menu</i> */}
        {/*       </a> */}
        {/*       <ul className="left hide-on-med-and-down"> */}
        {/*         {menu.map(link => ( */}
        {/*           <Link to={link[1]}>{link[0]}</Link> */}
        {/*         ))} */}
        {/*       </ul> */}
        {/*     </div> */}
        {/*   </nav> */}

        {/*   <ul className="sidenav"> */}
        {/*     {menu.map(link => ( */}
        {/*       <NavLink to={link[1]}>{link[0]}</NavLink> */}
        {/*     ))} */}
        {/*   </ul> */}

        {/* <div className="col s3 offset-s3"> */}
        {/*   <img src={csgLogo} className="App-logo" alt="Carlton Scout Group" /> */}
        {/* </div> */}
        {/* </div> */}
      </header>
    );
  }
}

class CubNameAutoCompleteTextBox extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
      selectedOption: null,
    };
  }

  handleChange(selectedOption) {
    this.setState({
      data: this.state.data,
      selectedOption: selectedOption,
    });
  }

  render() {
    return (
      <div className="input-field col s12">
        <Select
          value={this.state.selectedOption}
          onChange={this.handleChange}
          options={this.state.data}
        />
      </div>
    );
  }
}

class Root extends Component {
  render() {
    return (
      <Redirect
        to={{
          pathname: "/sign-in",
          state: {
            from: this.props.location,
          },
        }}
      />
    );
  }
}

class SignInForm extends Component {
  render() {
    return (
      <div>
        <Header title="Sign In" />
        <div className="container">
          <div className="row">
            <div className="col s11">
              <CubNameAutoCompleteTextBox ref={ref => (this.cubName = ref)} />
            </div>
          </div>

          <div className="row">
            <div className="col s5 card-panel">
              <SignaturePad
                ref={ref => (this.cubSignaturePad = ref)}
                options={{ backgroundColor: "rgb(255,255,255)" }}
              />
            </div>
            <div className="col s5 offset-s1 card-panel">
              <SignaturePad
                ref={ref => (this.parentSignaturePad = ref)}
                options={{ backgroundColor: "rgb(255,255,255)" }}
              />
            </div>
          </div>

          <div className="row">
            <div className="center-align">
              <a
                className="btn waves-efect waves-light submitButton btn-large"
                onClick={() => this.sendFormData()}
              >
                Submit
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  sendFormData() {
    let passed = true;
    console.log(this.cubName.value);
    if (this.cubName.value === null || this.cubName.value === "") {
      passed = false;
      M.toast({ html: "Cub's name is required" });
    }

    if (!this.cubSignature || this.cubSignature.isEmpty()) {
      passed = false;
      M.toast({ html: "Cub's signature is required" });
    }

    if (!this.parentSignature || this.parentSignature.isEmpty()) {
      passed = false;
      M.toast({ html: "Parent's signature is required" });
    }

    if (passed) {
      fetch(`/sign-in`, {
        method: "post",
        body: {
          cubName: this.cubName.value,
          cubSignature: this.cubSignature.toDataURI(),
          parentSignature: this.parentSignature.toDataURI(),
        },
      });
    }
  }
}

class SignOutForm extends Component {
  render() {
    return (
      <div>
        <Header title="Sign Out" />
        <div className="container">
          <div className="row">
            <div className="col s11">
              <CubNameAutoCompleteTextBox ref={ref => (this.cubName = ref)} />
            </div>
          </div>

          <div className="row">
            <div className="col s11 card-panel">
              <SignaturePad
                ref={ref => (this.parentSignaturePad = ref)}
                options={{ backgroundColor: "rgb(255,255,255)" }}
              />
            </div>
          </div>

          <div className="row">
            <div className="col s11">
              <button className="btn wave-effoect waves-light">Submit</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

class Settings extends Component {
  render() {
    return <Header title="Settings" />;
  }
}

class Privacy extends Component {
  render() {
    return <Header title="Privacy" />;
  }
}

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Route path="/" exact component={Root} />
          <Route path="/sign-in" exact component={SignInForm} />
          <Route path="/sign-out" exact component={SignOutForm} />
          <Route path="/settings" exact component={Settings} />
          <Route path="/privacy" exact component={Privacy} />
        </div>
      </Router>
    );
  }
}

export default App;
