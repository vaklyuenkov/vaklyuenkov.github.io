import React, { useContext } from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";
import DashboardIcon from "@material-ui/icons/Dashboard";
import AssignmentIcon from "@material-ui/icons/Assignment";
import { AppContext } from "./provider";

function MainListItems() {
  const { setContentUrl } = useContext(AppContext);
  function changeContentUrl(url) {
    setContentUrl(url);
  }
  return (
    <div>
      <ListItem
        button
        onClick={() => {
          changeContentUrl("/contents/About.md");
        }}
      >
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="About" />
      </ListItem>
    </div>
  );
}

function TransformerItems() {
  const { setContentUrl } = useContext(AppContext);
  function changeContentUrl(url) {
    setContentUrl(url);
  }
  return (
    <div>
      <ListSubheader inset>Posts</ListSubheader>
      <ListItem button
        onClick={() => {
          changeContentUrl("/contents/posts/transformers/SelfAttention.md");
        }}
      >
        <ListItemIcon>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText primary="Self Attention" />
      </ListItem>
    </div>
  );
}


export { MainListItems, TransformerItems };
