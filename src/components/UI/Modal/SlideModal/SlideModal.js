import React from "react";

//Lazy loading for Code Splitting
import asyncComponent from '../../../../hoc/AsyncComponent/AsyncComponent';

//Custom components
//import AppIcon from '../../AppIcon/AppIcon'

//Style injections
import { withStyles } from "@material-ui/core/styles";
import slideModalStyle from "./SlideModalStyle";

//Material-UI components
const Dialog = asyncComponent(() => import("@material-ui/core/Dialog"));
//const DialogContent = asyncComponent(()=>import("@material-ui/core/DialogContent"));
const AppBar = asyncComponent(() => import("@material-ui/core/AppBar"));
const Toolbar = asyncComponent(() => import("@material-ui/core/Toolbar"));
const IconButton = asyncComponent(() => import("@material-ui/core/IconButton"));
const Typography = asyncComponent(() => import("@material-ui/core/Typography"));
const Avatar = asyncComponent(() => import("@material-ui/core/Avatar"));

//Materia Icon
const Close = asyncComponent(() => import('@material-ui/icons/Close'));

const slideModal = props => {
    const {
        classes,
        children,
        open,
        handleClose,
        title,
        transition,
        icon,
        position
    } = props;

    return (
        <div>
            <Dialog
                fullScreen
                open={open}
                onClose={handleClose}
                TransitionComponent={transition}
            >

                <AppBar className={position ? classes.appBarAbsolute :classes.appBar}>
                    <Toolbar>
                        {icon ? <Avatar src={icon} className={classes.avatar} /> : null}
                        <Typography variant="subtitle1" color="inherit" className={classes.flex}>
                            {title}
                        </Typography>
                        <IconButton
                            onClick={handleClose}
                            aria-label="Close"
                            color="inherit"
                        >
                            {/*<AppIcon icon={{font: 'material', name:'close'}}/>*/}
                            <Close />
                        </IconButton>
                    </Toolbar>
                </AppBar>
                {children}

            </Dialog>
        </div>
    );
};

export default withStyles(slideModalStyle)(slideModal);
