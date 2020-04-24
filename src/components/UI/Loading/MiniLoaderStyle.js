const loadingStyle = theme => ({
    root: {
        display: "flex",
        justifyContent: 'center',
    },

    container: {
        justifyContent: "center",
    },

    loaderContainer: {
        width: '100%',
        display: "flex",
        //marginTop: theme.spacing(2),
        //marginBottom: theme.spacing(1),
        //padding: theme.spacing(1),
        justifyContent: "center",
        minHeight: '60px'
    },

    titleContainer: {
        display: "flex",
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
        justifyContent: "center"
    },

    typo: {
         textAlign: "center",
    },

    spinner: {
        padding: theme.spacing(1)
    }
});

export default loadingStyle;
