import React from 'react';
import Avatar from "@material-ui/core/Avatar";

import imageLogo from '../../../assets/img/logo/240x240.png';

// Import local style
import LogoStyle from "./LogoStyle";
import {withStyles} from "@material-ui/core/styles/index";


const logo = ({classes, ...other}) => {

    return (
        <Avatar className={classes.logo} src={imageLogo} {...other} />
    )
};

export default withStyles(LogoStyle)(logo)

