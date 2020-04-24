const mediaCardStyle = theme => ({

    card: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
        marginLeft: "auto",
        marginRight: "auto",
    },
    media: {
        height: 140
    },
    actions: {
        display: "flex"
    },
    acceptedCoin: {
        marginLeft: "auto"
    },
    coinToGive: {
        
    },
    favorite: {
        position: "absolute",
        right: theme.spacing(1),
        top: theme.spacing(1)
    },
    owned: {
        position: "absolute",
        left: theme.spacing(1),
        top: theme.spacing(1)
    }
});

export default mediaCardStyle;