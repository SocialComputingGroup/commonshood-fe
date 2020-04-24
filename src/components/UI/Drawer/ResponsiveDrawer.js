/* Responsive Drawer */
import React from "react";

//Lazy loading for Code Splitting
import asyncComponent from '../../../hoc/AsyncComponent/AsyncComponent';

// Style injections
import { withStyles } from "@material-ui/core/styles";
import responsiveDrawerStyle from "./ResponsiveDrawerStyle";

const Hidden = asyncComponent(()=> import("@material-ui/core/Hidden"));
const Drawer = asyncComponent(()=> import("@material-ui/core/Drawer"));
const Divider = asyncComponent(()=> import("@material-ui/core/Divider"));


const responsiveDrawer = ({
  direction,
  mobileOpen,
  handleDrawerToggle,
    userDataComponent,
  classes,
  children
}) => {
    const drawer = (
        <div className={classes.cursor}>
            <div className={classes.toolbar} >{userDataComponent}</div>
            <Divider />
            {children}
        </div>
    );

  return (
    <React.Fragment>
      <Hidden smUp>
        <Drawer
          variant="temporary"
          anchor={direction === "rtl" ? "right" : "left"}
          open={mobileOpen}
          onClose={handleDrawerToggle}
          classes={{
            paper: classes.drawerPaper
          }}
          ModalProps={{
            keepMounted: true // Better open performance on mobile.
          }}
        >
          {drawer}
        </Drawer>
      </Hidden>
      <Hidden xsDown implementation="css">
        <Drawer
          variant="permanent"
          open
          classes={{
            paper: classes.drawerPaper
          }}
        >
          {drawer}
        </Drawer>
      </Hidden>
    </React.Fragment>
  );
};
export default withStyles(responsiveDrawerStyle)(responsiveDrawer);
