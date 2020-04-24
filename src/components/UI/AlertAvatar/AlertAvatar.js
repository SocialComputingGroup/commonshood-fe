import React from "react";
import PropTypes from "prop-types";

import { withStyles } from "@material-ui/core/styles";
import alertAvatarStyle from "./AlertAvatarStyle";
import Avatar from "@material-ui/core/Avatar";
import CheckIcon from "@material-ui/icons/Check";
import WarningIcon from "@material-ui/icons/Warning";
import NewReleasesIcon from "@material-ui/icons/NewReleases";
import InfoIcon from "@material-ui/icons/Info";
import Grow from "@material-ui/core/Grow";

import Typography from "@material-ui/core/Typography";


import classnames from "classnames";

const alertAvatar = props => {
    const { classes, success, warning, fail, big, text} = props;

    const avatarClasses = classnames({
        [classes.avatarBase]: true,
        [classes.bigAvatar]: big,
        [classes.default]: !success && !warning && !fail,
        [classes.success]: success,
        [classes.warning]: warning,
        [classes.fail]: fail
    });

    let textTypography = null;
    if(text){
        textTypography = <Typography variant="body1">{text}</Typography>;
    }

    return (
        <div style={{display: 'flex', alignItems: 'center'}}>
            <Avatar className={avatarClasses}>
                <Grow in timeout={800}>
                    <div className={classes.iconDiv}>
                        {success ? (
                            <CheckIcon className={big ? classes.bigAvatarIcon : null} />
                        ) : fail ? (
                            <NewReleasesIcon className={big ? classes.bigAvatarIcon : null} />
                        ) : warning ? (
                            <WarningIcon className={big ? classes.bigAvatarIcon : null} />
                        ) : (
                            <InfoIcon className={big ? classes.bigAvatarIcon : null} />
                        )}
                    </div>
                </Grow>
            </Avatar>
            {textTypography}
        </div>
    );
};



alertAvatar.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(alertAvatarStyle)(alertAvatar);

