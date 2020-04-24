

const featuredCardStyle = theme => ({
    cardTitle: {
        color: theme.palette.grey[100],
        textDecoration: "none",
        //fontWeight: "700",
        fontFamily: `"Roboto Slab", "Times New Roman", serif`
    },

    textSecondary: {
        color: theme.palette.grey[100]
    },
    textCenter: {
        textAlign: "center"
    },
    textMuted: {
        color: "#6c757d"
    }
});

export default featuredCardStyle;