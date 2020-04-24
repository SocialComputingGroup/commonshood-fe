import React from 'react';

import withStyles from '@material-ui/core/styles/withStyles'

//Material UI Components
import Typography from '@material-ui/core/Typography'

//JSS Styles
import pageTitleStyle from './PageTitleStyle'

const pageTitle = (props) => {
    const {classes} = props;
    return (
        <div className={classes.textTitle}>
            <Typography className={classes.titleFont} variant="subtitle1">
                {props.title}
            </Typography>
        </div>
    );
};

export default withStyles(pageTitleStyle)(pageTitle);
