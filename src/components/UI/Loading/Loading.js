import React from "react";

// Material-Ui Components
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";

import withStyles from "@material-ui/core/styles/withStyles";

//Custom components
import Logo from '../Logo/Logo'

import loadingStyle from "./LoadingStyle";
const Loading = props => {
    const {
        title,
        withLoader,
        classes } = props;
    return (
        <div className={classes.root}>
            <Paper className={classes.paper} elevation={3}>
                <Grid container className={classes.container} >

                    <Grid item className={classes.avatarContainer} >
                        <Logo />
                    </Grid>
                    <Grid item className={classes.titleContainer} >
                        <Typography className={classes.typo} variant="h5">
                            {title}
                        </Typography>
                    </Grid>
                {withLoader ?
                    <Grid item className={classes.loaderContainer}>
                        <CircularProgress className={classes.spinner}/>
                    </Grid>
                    : null}
                </Grid>
            </Paper>
        </div>
    );
};

export default withStyles(loadingStyle)(Loading);
