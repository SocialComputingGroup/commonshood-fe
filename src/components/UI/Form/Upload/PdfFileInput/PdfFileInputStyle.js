const customFileInputStyle = theme => (
{
    inputFile: {
        opacity: "0",
        position: "absolute",
        top: "0",
        right: "0",
        bottom: "0",
        left: "0",
        width: "100%",
        height: "100%",
        zIndex: "-1"
    },
    input: {
        marginTop: "1rem",
    },
    errorLabel: {
        color: theme.palette.secondary.main
    },
});

export default customFileInputStyle;