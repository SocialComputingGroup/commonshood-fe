import React from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Fade from "@material-ui/core/Fade";
import { withStyles } from "@material-ui/core/styles";
import { withSizes } from "react-sizes";

//Custom components
import AlertAvatar from '../AlertAvatar/AlertAvatar'
import Logo from '../Logo/Logo';

import splashScreenStyle from "./SplashScreenStyle";
//import classnames from "classnames";

const splashScreen = ({ classes, title, pageHeight, pageWidth, children, avatarProps }) => {
    return (
        <div className={classes.page} style={{ height: pageHeight - 50 }}>
            <Fade in timeout={500}>
                <Paper elevation={4} className={classes.paper}>
                    <Grid container className={classes.splash}>
                        <Grid item className={classes.splashAvatarContainer}>
                            <Logo />
                        </Grid>
                        <Grid item className={classes.splashTextContainer}>
                            <Typography variant="h4" className={classes.splashText}>
                                {title}
                            </Typography>
                        </Grid>
                        <Grid item className={classes.splashAvatarContainer}>
                           <AlertAvatar {...avatarProps}/>
                        </Grid>
                        <Grid item className={classes.splashTextContainer}>
                            <Typography className={classes.splashText} component="div">
                                {children}
                            </Typography>
                        </Grid>
                    </Grid>
                </Paper>
            </Fade>
        </div>
    );
};

const mapSizesToProps = ({ width, height }) => ({
    pageWidth: width,
    pageHeight: height
});

export default withSizes(mapSizesToProps)(
    withStyles(splashScreenStyle)(splashScreen)
);
