const slideModalStyle = theme => (
    {
        appBar: {
            position: "relative"
        },
        appBarAbsolute: {
            postion: "absolute"
        },
        flex: {
            flex: 1
        },
        margintop: {
            marginTop: theme.mixins.toolbar.minHeight
        },

        mainPadding: { padding: "1em 3em" },
        avatar : {
            marginRight: theme.spacing(1)
        },
        children: {
            paddingTop: 40
        }
    }
);

export default slideModalStyle;