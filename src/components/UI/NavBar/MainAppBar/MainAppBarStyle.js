/* JSS Style */

// TODO: Import from config
const drawerWidth = 240;

const mainAppBarStyle = theme => ({
    title: {
        flexGrow: 1
    },
    // mainAppBar: {
    //     display: 'flex',
    //     position: 'absolute',
    //     zIndex: theme.zIndex.drawer +1
    // },
    mainAppBar: {
        //position: "relative",

        [theme.breakpoints.up("sm")]: {
            marginLeft: drawerWidth,
            width: `calc(100% - ${drawerWidth}px)`
        }
    },
});
export default mainAppBarStyle;