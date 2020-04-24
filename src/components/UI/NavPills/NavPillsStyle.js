const drawerWidth = 240;

const navPillsStyle = theme => ({
    root: {
        backgroundColor: theme.palette.background.paper,
        width: "100%",
        overflowY: 'hidden'
    },

    appBar: {
        top: 'auto',
        marginTop: -theme.spacing(2),
        backgroundColor: theme.palette.background.paper,
        [theme.breakpoints.up("sm")]: {
            marginLeft: drawerWidth,
            marginTop: -theme.spacing(1),
            width: `calc(100% - ${drawerWidth}px)`
        }
    },

    pages: {
        marginTop: 80 + theme.spacing(1)
    },

    pillsContainer: {
        display: "none !important"
    },
    pill: {
        //color: theme.palette.primary.main,
        color: theme.palette.primary.main,
        padding: theme.spacing(1) /2 ,
        margin: theme.spacing(1),
        minWidth: "80px",
        borderRadius: "4px",
        transition: "all .3s",
        "&:hover": {
            color: "#FFFFFF",
            backgroundColor: theme.palette.primary.main,
            boxShadow:
                "0 4px 20px 0px rgba(0, 0, 0, 0.14), 0 7px 10px -5px rgba(21, 101, 192, 0.4)"
        },
        "&.selected, &.active": {
            color: "#FFFFFF",
            backgroundColor: theme.palette.primary.main,
            boxShadow:
                "0 4px 20px 0px rgba(0, 0, 0, 0.14), 0 7px 10px -5px rgba(21, 101, 192, 0.4)"
        }
    },
    pillSelected: {
        color: "#FFFFFF",
        backgroundColor: theme.palette.primary.main,
        boxShadow:
            "0 4px 20px 0px rgba(0, 0, 0, 0.14), 0 7px 10px -5px rgba(21, 101, 192, 0.4)"
    }
});

export default navPillsStyle