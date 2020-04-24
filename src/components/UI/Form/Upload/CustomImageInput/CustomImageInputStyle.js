// Styling Image Input
const customImageInputStyle = theme => ({
    container: {
        margin: 'auto',
    },
    hidden: { display: "none" },

    title: {
        margin: 'auto',
        display: 'flex',
        justifyContent: 'center',
        //fontFamily:'Roboto Slab',
        //fontWeight:'bold',
        padding: theme.spacing(1)
    },
    bigAvatar: {
        margin: 'auto',
        textAlign: "center",
        width: 80,
        height: 80,
        borderColor: theme.palette.primary.main,
        borderStyle: "solid",
        borderSize: "1px"
    },
    avatarThumb: {
        maxWidth: 80,
        maxHeight: 80
    },
    imageThumb: {
        maxHeight: 300,
        witdh: '100%'
    },
    primaryBack: {
        background: theme.palette.primary.main
    },
    whiteBack: {
        background: "white"
    },

    errorBack: { background: theme.palette.error.main }
});
export default customImageInputStyle;
