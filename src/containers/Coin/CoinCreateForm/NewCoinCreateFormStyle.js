const newCoinCreateFormStyle = theme =>( {
    fieldContainer: {
        display: 'flex',
        justifyContent:'center'
    },
    buttons: {
        backgroundColor: theme.palette.secondary.main,
        color: theme.palette.grey[200],
        margin: theme.spacing(1)
    },
    bigAvatar: {
        backgroundColor: 'white',
        margin: 'auto',
        width: 80,
        height: 80,
        borderColor: theme.palette.primary.main,
        borderStyle: "solid",
        borderSize: "1px"
    },
    avatarThumb: {
        maxWidth: 80,
        maxHeight: 80
    }
});
export default newCoinCreateFormStyle;