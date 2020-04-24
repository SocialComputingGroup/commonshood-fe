const loadingStyle = theme => ({
    root: {
        display: "flex",
        justifyContent: 'center'
    },
    paper: {
        width: '100%',
        ...theme.mixins.gutters(),
        margin: theme.spacing(1),
        minHeight: '300px',
        //maxWidth:"800px",
        //flexDirection: 'column',
    },
    container: {
        ...theme.mixins.gutters(),
        display: "flex",
        width: "100%",
        height: "calc( 100% - 8px)",
        //flexDirection: 'column',
        justifyContent: "center",
    },

    avatarContainer: {
        display: "flex",
        width: "100%",
        flexGrow: 1,
        justifyContent: "center"
    },
    titleContainer: {
        width: '100%',
        display: "flex",
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
        justifyContent: "center"
    },
    loaderContainer: {
        width: '100%',
        display: "flex",
        //marginTop: theme.spacing(1) * 2,
        //marginBottom: theme.spacing(1),
        padding: theme.spacing(1),
        justifyContent: "center"
    },
    // avatar: {
    //     width: theme.spacing(20),
    //     height: theme.spacing(20),
    //     margin: theme.spacing(1),
    //     boxShadow: "4px 4px 5px rgba(0,0,0,0.75)"
    // },
     typo: {
    //     //flexGrow: '1',
    //     padding: theme.spacing(1),
         textAlign: "center",
    //     width: "100%"
    },
    spinner: {
        padding: theme.spacing(1)
    }
});

export default loadingStyle;
