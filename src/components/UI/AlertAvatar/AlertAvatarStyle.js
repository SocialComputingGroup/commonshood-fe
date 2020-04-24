import green from "@material-ui/core/colors/green";
import red from "@material-ui/core/colors/red";
import amber from "@material-ui/core/colors/amber";

const alertAvatarStyles = theme => ({
    iconDiv: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },

    bigAvatar: {
        width: 80,
        height: 80
    },

    bigAvatarIcon: {
        fontSize: 65
    },

    success: {
        color: green[500],
        borderColor: green[500]
    },

    fail: {
        color: red[500],
        borderColor: red[500]
    },

    warning: {
        color: amber[300],
        borderColor: amber[300]
    },

    default: {
        color: theme.palette.primary.main,
        borderColor: theme.palette.primary.main
    },

    avatarBase: {
        margin: 10,
        backgroundColor: "transparent",
        //border: '3px solid',
        borderRadius: "50%",
        animationName: "rotateBorder",
        animationDuration: "0.7s",
        animationTimingFunction: "ease-in-out",
        animationFillMode: "forwards"
    },

    "@keyframes rotateBorder": {
        "0%": { border: "0px" },
        "25%": {
            borderTop: "3px solid",
            borderRight: "3px solid"
        },
        "50%": {
            borderRight: "3px solid",
            borderBottom: "3px solid"
        },
        "75%": {
            borderBottom: "3px solid",
            borderLeft: "3px solid"
        },
        "100%": { border: "3px solid" }
    }
});

export default alertAvatarStyles;
