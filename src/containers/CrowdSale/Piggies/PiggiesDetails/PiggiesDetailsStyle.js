import red from "@material-ui/core/colors/red";

const piggiesDetailsStyle = theme => ({
    showWarningText:{
        color: theme.palette.warning.main,
        display: "block"
    },
    doNotShowWarningText:{
        display: "none",
    },
    card: {
        overflow: "auto",
    },
    media: {
        objectFit: 'cover',
        maxHeight: "300px",
    },
    actions: {
        display: "flex"
    },
    expand: {
        transform: "rotate(0deg)",
        marginLeft: "auto",
        transition: theme.transitions.create("transform", {
            duration: theme.transitions.duration.shortest
        })
    },
    expandOpen: {
        transform: "rotate(180deg)"
    },
    avatar: {
        backgroundColor: red[500]
    },
    favorite: {
        marginLeft: 350,
        marginTop: -400
    },
    end: {
        marginLeft: "auto"
    },
    center: {
        justifyContent: "center"
    },
    button: {},
    gridList: {
        width: 400,
        height: 410
    },
    root: {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-around",
        overflow: "hidden",
        backgroundColor: theme.palette.background.paper
    }
});

export default piggiesDetailsStyle;