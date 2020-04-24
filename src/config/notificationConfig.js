import React from 'react';

//
import CheckIcon from "@material-ui/icons/Check";
import WarningIcon from "@material-ui/icons/Warning";
import NewReleasesIcon from "@material-ui/icons/NewReleases";
import InfoIcon from "@material-ui/icons/Info";

const notificationConfig = {
    menuListLength: 4,
    categories: {
        success: <CheckIcon/>,
        danger: <NewReleasesIcon/>,
        warning: <WarningIcon/>,
        info: <InfoIcon/>,
    }
};

export default notificationConfig;