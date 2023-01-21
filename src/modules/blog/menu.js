import React, { useContext } from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";
import PersonIcon from "@material-ui/icons/Person";
import GridOffIcon from "@material-ui/icons/GridOff";
import SettingsIcon from "@material-ui/icons/Settings";
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
          <PersonIcon />
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
      <ListSubheader inset>Transformers</ListSubheader>
      <ListItem button
        onClick={() => {
          changeContentUrl("/contents/posts/transformers/SelfAttention.md");
        }}
      >
        <ListItemIcon>
          <GridOffIcon />
        </ListItemIcon>
        <ListItemText primary="Self Attention" />
      </ListItem>
    </div>
  );
}

function SysDesignItems() {
  const { setContentUrl } = useContext(AppContext);
  function changeContentUrl(url) {
    setContentUrl(url);
  }
  return (
    <div>
      <ListSubheader inset>System design</ListSubheader>
      <ListItem button
        onClick={() => {
          changeContentUrl("/contents/posts/sys_design/sys_design/SystemDesignMain.md");
        }}
      >
        <ListItemIcon>
          <SettingsIcon />
        </ListItemIcon>
        <ListItemText primary="Sys. des. algorithm" />
      </ListItem>

      <ListItem button
        onClick={() => {
          changeContentUrl("/contents/posts/sys_design/mlops/MlOps.md");
        }}>
        <ListItemIcon>
          <SettingsIcon />
        </ListItemIcon>
        <ListItemText primary="MlOps" />
      </ListItem>

    </div>
  );
}




export { MainListItems, TransformerItems, SysDesignItems };
