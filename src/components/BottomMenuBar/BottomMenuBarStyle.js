const drawerWidth = 240;

const bottomMenuBarStyle = theme => ({
    stickToBottom: {
        width: '100%',
        position: 'fixed',
        margin: "auto",
        bottom: 0,
        right: 0,
        [theme.breakpoints.up("sm")]: {
            marginTop: -theme.spacing(1),
            width: `calc(100% - ${drawerWidth}px)`
        },
        //borderTop: '2px rgba(0, 0, 0, 0.20) solid',
        boxShadow: '0px -2px 5px 0px rgba(0,0,0,0.18)'
    },
    buttonStyle: {
        color: 'rgba(0, 0, 0, 0.54)',
    }
});

export default bottomMenuBarStyle;
