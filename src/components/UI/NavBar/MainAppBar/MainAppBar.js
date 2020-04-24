import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import * as actions from "../../../../store/actions";


import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import Icon from '@material-ui/core/Icon'
import Hidden from '@material-ui/core/Hidden'
import Avatar from '@material-ui/core/Avatar'

import withStyles from '@material-ui/core/styles/withStyles';

import mainAppBarStyle from './MainAppBarStyle';

import place_placeholder from "../../../../assets/img/home-green.png";

import {logger} from '../../../../utilities/winstonLogging/winstonInit';
//Custom components
import NotificationMenuList from '../../../Notification/NotificationMenuList/NotificationMenuList';

//Notification list config
import notificationConfig from '../../../../config/notificationConfig';

const MainAppBar = (props) => {
    const {
        title,
        drawerHandler,
        classes,
        profile,
        removeMessage,
        setMessageAsRead,
        msgList
    } = props;
    
    const [anchorEl, setAnchorEl] = useState(null);

    useEffect( () => {
        if(msgList.length === 0){
            handleClose();
        }
    }, [msgList]);

    const handleMenu = event => {
        setAnchorEl( event.currentTarget );
    };

    const handleClose = () => {
        setAnchorEl( null );
    };

    const handleClickOnNotification = (event,item) => {
        removeMessage(item.id);
        setMessageAsRead(item.id);
    };

    const open = Boolean(anchorEl);
    let notifyIcon = (<Icon>notifications</Icon>);
    let shortList = [];
    logger.debug('MainAppBar -> NOTIFICATION MSGLIST ', msgList);
    if (msgList) {
        shortList = msgList.slice(0,notificationConfig.menuListLength); //to show a limited number of notifications 
        notifyIcon = (
            <Badge color='secondary' badgeContent={msgList.length}>
                <Icon>notifications</Icon>
            </Badge>
        )
    }

    let avatar = place_placeholder;
    if (profile && profile.realm === "user")
        avatar = profile.avatar;

    return (
            <AppBar className={classes.mainAppBar} >
                <Toolbar>
                    <Hidden smUp>
                        <IconButton
                            color="inherit"
                            aria-label="Menu"
                            onClick={drawerHandler}
                        >
                            <Icon>menu</Icon>
                        </IconButton>
                    </Hidden>
                    <Avatar src={avatar} />
                    <Typography variant="h6" color="inherit" className={classes.title}>
                        {<span>&nbsp;</span>}{ title }
                    </Typography>
{/*                     
                    <IconButton
                        aria-owns={open ? 'menu-appbar' : null}
                        aria-haspopup="true"
                        onClick={handleMenu}
                        color="inherit"
                    >
                        {notifyIcon}
                    </IconButton> */}

                    {/* Notification Menu */}
                    {shortList.length !== 0 ?
                    <NotificationMenuList
                        notificationList={shortList}
                        id="menu-appbar"
                        anchorEl={anchorEl}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                        open={open}
                        onEmpty={handleClose}
                        onClickOnNotification={handleClickOnNotification}
                    /> : null }

                </Toolbar>
            </AppBar>

    );
    
}


const mapStateToProps = state => {
    return {        
        msgList: state.notification.notificationsOfCurrentSession,
    }
};


const mapDispatchToProps = dispatch => {
    return {
        removeMessage: (messageId) => dispatch(actions.notificationRemoveFromCurrentlyListed(messageId)),
        setMessageAsRead: (messageId) => dispatch(actions.notificationSetRead(messageId)),
    }
};


export default withStyles(mainAppBarStyle)( connect(mapStateToProps,mapDispatchToProps)(MainAppBar) );