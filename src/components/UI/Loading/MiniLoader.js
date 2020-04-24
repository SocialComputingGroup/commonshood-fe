import React from 'react';

//Material Styling
import { withStyles } from '@material-ui/core/styles';
import MiniLoaderStyle from './MiniLoaderStyle';

import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

const miniLoader = props => {
    const {classes, text, t} = props;
    return (
        <div className={classes.root}>
            <Grid container className={classes.container}>
                <Grid item className={classes.titleContainer} >
                    <Typography className={classes.typo}>
                        {text ? text : t('Common:loadingGeneric') +'...' }
                    </Typography>
                </Grid>
                <Grid item className={classes.loaderContainer}>
                    <CircularProgress size={30} className={classes.spinner}/>
                </Grid>
            </Grid>
        </div>
    );
};

export default withStyles(MiniLoaderStyle)(miniLoader);