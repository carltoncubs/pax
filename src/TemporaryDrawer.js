import React, { Component } from "react";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";

export class TemporaryDrawer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: props.isOpen ? props.isOpen : false,
      items: props.items ? props.items : []
    };
  }

  toggleDrawer() {
    this.setState({
      isOpen: !this.state.isOpen,
      items: this.state.items
    });
  }

  render() {
    const list = (
      <List>
        {this.state.items.map(item => (
          <ListItem button key={item[1]} component="a" href={item[1]}>
            <ListItemText primary={item[0]} className="black-text" />
          </ListItem>
        ))}
      </List>
    );
    return (
      <div>
        <IconButton
          color="inherit"
          aria-label="Menu"
          onClick={() => this.toggleDrawer()}
        >
          <MenuIcon />
        </IconButton>
        <Drawer
          open={this.state.isOpen}
          onClose={() => this.toggleDrawer()}
          onKeyDown={() => this.toggleDrawer()}
        >
          {list}
        </Drawer>
      </div>
    );
  }
}
