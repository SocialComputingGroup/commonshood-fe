const splashScreenStyle = theme => ({
    page: {
        display: "flex"
    },
    paper: {
        ...theme.mixins.gutters(),
        marginTop: theme.spacing(1),
        marginLeft: 'auto',
        marginRight: 'auto',
        color: theme.palette.grey[200] + ' !important',
        //width: 300,
        height: 500,
        backgroundColor: theme.palette.primary.main
    },
    splash: {
        display: "flex",
        width: "100%",
        height: "calc( 100% - 8px)",
        //flexDirection: 'column',
        justifyContent: "center",

    },
    splashAvatarContainer: {
        display: "flex",
        width: "100%",
        flexGrow: 1,
        justifyContent: "center"
    },

    splashAvatar: {
        width: theme.spacing(20),
        height: theme.spacing(20),
        margin: theme.spacing(1),
        boxShadow: "4px 4px 5px rgba(0,0,0,0.75)"
    },
    splashTextContainer: {
        display: "flex",
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(2),
        justifyContent: "center"
    },
    splashButtonContainer: {
        display: "flex",
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(1)
    },

    splashText: {
        color: theme.palette.grey[200] + ' !important',
        textAlign: 'center'
    },

    splashButton: {
        height: "50%",
        backgroundColor: theme.palette.secondary.light
    },

    icon: {
        fontSize: '80pt'
    }
});

export default splashScreenStyle;