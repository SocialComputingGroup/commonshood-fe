/* JSS Layout Style */

const drawerWidth = 240;

const layoutStyle = theme => ({
    root: {
        flexGrow: 1,
        height: "100%",
        //zIndex: 100,
        overflow: "hidden",
        position: "relative",
        display: "flex",
        width: "100%"
    },
    appBar: {
        //position: "relative",

        [theme.breakpoints.up("sm")]: {
            marginLeft: drawerWidth,
            width: `calc(100% - ${drawerWidth}px)`
        }
    },
    bottomAppBar: {
        top: 'auto',
        bottom: 0,
        [theme.breakpoints.up("sm")]: {
            marginLeft: drawerWidth,
            width: `calc(100% - ${drawerWidth}px)`
        }
    },
    navIconHide: {
        [theme.breakpoints.up("sm")]: {
            display: "none"
        }
    },

    gridItem: {
        width: '100%',
        marginBottom: '50px',
    },

    content: {
        //display: 'flex',
        //position: 'relative',
        flexGrow: 1,
        backgroundColor: "#FFF",
        marginTop: theme.mixins.toolbar.minHeight - theme.spacing(1),
        // marginLeft: 'auto',
        // marginRight: 'auto',
        padding: theme.spacing(1),
        justify: 'center',
        [theme.breakpoints.up("sm")]: {
            marginLeft: drawerWidth - theme.spacing(1), //adjust for basic padding
            width: `calc(100% - ${drawerWidth}px)`
        }

    },

    logo: {
      width: 80,
      height: 80,
      margin: "0 auto",
      marginTop: 15
    }
});

export default layoutStyle;

