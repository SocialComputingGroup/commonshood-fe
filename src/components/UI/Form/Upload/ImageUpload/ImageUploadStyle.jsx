
const imageUploadStyle = theme => ({
    elementDiv: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    },
    bigAvatar: {
        width: 80,
        height: 80,
        background: theme.palette.primary.main
    },

    whiteBackground: {
        background: 'white'
    },
    avatarThumb: {
        maxWidth: 80,
        maxHeight: 80,
    },

    fileInput: {
        display: "none"
    },
    icon: {
        color: 'white',
        fontSize: '7em'
    },
    title: {
        padding: theme.spacing(1)
    }
})

export default imageUploadStyle;