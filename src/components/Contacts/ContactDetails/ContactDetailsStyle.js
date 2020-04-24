import grey from '@material-ui/core/colors/grey'
import amber from "@material-ui/core/colors/yellow";

const coinDetailsStyle = theme =>( {
    avatar: {
        width: '120px !important',
        height: '120px !important'
    },
    margintop: { marginTop: theme.spacing(1) },
    mainpadding: { padding: theme.spacing(1) },

    favorite: {
        color: amber[800]
    },

    favoritePosition: {
        left: '-11px'
    }
});

export default coinDetailsStyle;