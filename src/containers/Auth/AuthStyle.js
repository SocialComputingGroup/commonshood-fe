const authStyle = theme => (
    {
        mainContainer: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column'
        },
        title: {
            margin: 'auto',
            width: '100%',
            display: 'flex',
            flexGrow: '1',
            padding: theme.spacing(2),
            justifyContent: 'center'
        },
        spinner: {
            margin: 'auto',
            width: '100%',
            display: 'flex',
            padding: theme.spacing(2)
        }
    }

);

export default authStyle;