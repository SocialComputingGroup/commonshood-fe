const drawerWidth = 240;

const responsiveDrawerStyle = theme => ({
  drawerPaper: {
    width: drawerWidth,
    height: "100%",
    [theme.breakpoints.up("md")]: {
      //position: "relative"
    }
  },

    toolbar: theme.mixins.toolbar,
    cursor: {cursor: "pointer"}
});

export default responsiveDrawerStyle;
