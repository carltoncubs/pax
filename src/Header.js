import AccountCircle from "@material-ui/icons/AccountCircle";
import AppBar from "@material-ui/core/AppBar";
import Email from "@material-ui/icons/Email";
import PowerSettingNew from "@material-ui/icons/PowerSettingsNew";
import IconButton from "@material-ui/core/IconButton";
import ListItem from "@material-ui/core/ListItem";
import List from "@material-ui/core/List";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Person from "@material-ui/icons/Person";
import Popover from "@material-ui/core/Popover";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { GoogleLogout } from "react-google-login";

import { TemporaryDrawer } from "./TemporaryDrawer.js";

const styles = {
  root: {
    flexGrow: 1
  },
  grow: {
    flexGrow: 1
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  }
};

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null,
      menu: this.setupMenu()
    };
  }

  componentDidMount() {
    this.setState({
      menu: this.setupMenu()
    });
  }

  handleMenu(event) {
    this.setState({ anchorEl: event.currentTarget });
  }

  handleClose() {
    this.setState({ anchorEl: null });
  }

  setupMenu() {
    var menu = [
      { name: "Sign In", href: "/sign-in" },
      { name: "Sign Out", href: "/sign-out" },
      { name: "Settings", href: "/settings" },
      { name: "Privacy", href: "/privacy" }
    ];

    for (var i = 0; i < menu.length; i++) {
      menu[i].selected = menu[i].name === this.props.title;
    }
    return menu;
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <TemporaryDrawer
              items={this.state.menu}
              className={classes.menuButton}
            />
            <Typography
              variant="h4"
              color="inherit"
              className={classes.grow}
              id="header-title"
            >
              {this.props.title}
            </Typography>
            {this.props.auth && (
              <div>
                <IconButton
                  onClick={event => this.handleMenu(event)}
                  color="inherit"
                  aria-haspopup="true"
                  aria-owns={
                    Boolean(this.state.anchorEl) ? "menu-appbar" : undefined
                  }
                  id="auth-button"
                >
                  <AccountCircle />
                </IconButton>
                <Popover
                  id="menu-appbar"
                  anchorEl={this.state.anchorEl}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right"
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right"
                  }}
                  open={Boolean(this.state.anchorEl)}
                  onClose={() => this.handleClose()}
                >
                  <List id="user-info-list">
                    <ListItem id={this.props.user}>
                      <ListItemIcon>
                        <Person />
                      </ListItemIcon>
                      <ListItemText primary={this.props.user} id="user-name" />
                    </ListItem>
                    <ListItem id={this.props.email}>
                      <ListItemIcon>
                        <Email />
                      </ListItemIcon>
                      <ListItemText
                        primary={this.props.email}
                        id="user-email"
                      />
                    </ListItem>
                    <GoogleLogout
                      onLogoutSuccess={this.props.onLogout}
                      render={props => (
                        <ListItem id="logout" onClick={props.onClick} button>
                          <ListItemIcon>
                            <PowerSettingNew />
                          </ListItemIcon>
                          <ListItemText>Logout</ListItemText>
                        </ListItem>
                      )}
                    />
                  </List>
                </Popover>
              </div>
            )}
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

Header.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Header);
