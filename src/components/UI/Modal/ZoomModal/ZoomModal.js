import React from 'react';

// Inject local styles
import withStyles from '@material-ui/core/styles/withStyles';
import ZoomModalStyle from './ZoomModalStyle';

import {
    Dialog,
    DialogContent,
    DialogActions
} from '@material-ui/core'

//import Zoom from '@material-ui/core/Zoom'

//Custom components
import FeatureCard from '../../Card/FeaturedCard/FeaturedCard'

//const _transition = props => (<Zoom {...props}/>);

const zoomModal = props => {
    const {
        classes,
        title,
        buttons,
        children,
        open,
        onClose,
        ...rest
    } = props;

    return (
        <Dialog
            open={open}

            transitionDuration={200}
            TransitionProps={{ timeout: 300 }}

            onClose={onClose}
            classes={{
                paper: classes.root
            }}
            {...rest}
        >
            <FeatureCard
                title={title}
                >
                <DialogContent className={classes.content}>
                    {children}
                </DialogContent>
                <DialogActions className={classes.footer}>
                    {buttons}
                </DialogActions>
            </FeatureCard>
        </Dialog>
    );
};

export default withStyles(ZoomModalStyle)(zoomModal);
