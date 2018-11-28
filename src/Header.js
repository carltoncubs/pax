import React, { Component } from "react";
import PropTypes from "prop-types";
import { TemporaryDrawer } from "./TemporaryDrawer.js";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import AccountCircle from "@material-ui/icons/AccountCircle";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormGroup from "@material-ui/core/FormGroup";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import Popover from "@material-ui/core/Popover";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Person from "@material-ui/icons/Person";
import ListItemText from "@material-ui/core/ListItemText";
import Email from "@material-ui/icons/Email";

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
      anchorEl: null
    };
  }

  handleMenu(event) {
    this.setState({ anchorEl: event.currentTarget });
  }

  handleClose() {
    this.setState({ anchorEl: null });
  }

  render() {
    const menu = [
      ["Sign In", "/sign-in"],
      ["Sign Out", "/sign-out"],
      ["Settings", "/settings"],
      ["Privacy", "/privacy"]
    ];
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <TemporaryDrawer items={menu} className={classes.menuButton} />
            <Typography variant="h4" color="inherit" className={classes.grow}>
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
                  <ListItem>
                    <ListItemIcon>
                      <Person />
                    </ListItemIcon>
                    <ListItemText primary={this.props.user} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Email />
                    </ListItemIcon>
                    <ListItemText primary={this.props.email} />
                  </ListItem>
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
