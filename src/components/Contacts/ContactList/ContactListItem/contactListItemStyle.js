import amber from '@material-ui/core/colors/yellow';

const contactListItemStyle = theme => ({
    mainName: {
        paddingRight: theme.spacing(1),
    },
    favorite: {
        color: amber[800]
    },
    favoritePosition: {
        left: '-11px'
    },
    locationText: {
        paddingRight: '15px'
    }
});

export default contactListItemStyle;