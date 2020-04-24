import React from 'react';
import PropTypes from 'prop-types';
//import faker from 'faker';
import { useTranslation } from 'react-i18next';

//import asyncComponent from '../../hoc/AsyncComponent/AsyncComponent';
import Typography from '@material-ui/core/Typography';

//for js-to-css
import withStyles from '@material-ui/core/styles/withStyles'
import notificationStyle from './NotificationStyle';
import getNotificationText from '../../utilities/notification/notification-messages';

import notificationKeys from '../../utilities/notification/messageKeys';

const Notification = (props) => {

    const params = props.body.message.params;
    const messageKey = props.body.message.message_key;
    const type = props.type;
    let messageString = '';
    const {t} = useTranslation('NotificationMessages');


    try {
        messageString = getNotificationText(messageKey, params, type, t);
    }catch( error ){
        messageString = error.message;
    }


    //TODO use or remove if you need to put classes in a js-to-css file
    const classes = props.classes;

    const messageComponent = (
        <span className={classes.notificationText}>{messageString}</span>
    );


    return (
        <Typography
            variant="inherit"
            //align="left"
            noWrap >
        {messageComponent}
        </Typography>
    );


};

const CATEGORIES = ['user', 'coin', 'dao','other', 'crowdfunding'];
const TYPES = ['success', 'failure', 'danger', 'warning', 'info'];


Notification.propTypes = {
    id: PropTypes.number.isRequired,
    timestamp: PropTypes.instanceOf(Date).isRequired,
    type: PropTypes.oneOf(TYPES).isRequired,
    body: PropTypes.shape({
        category: PropTypes.oneOf(CATEGORIES).isRequired,
        object_id: PropTypes.string.isRequired,
        message: PropTypes.shape({
            message_key: PropTypes.oneOf(Object.values(notificationKeys)).isRequired,
            params: PropTypes.object.isRequired,
        }).isRequired,
    }).isRequired,
    //TODO check if we need these two on "isRequired"
    delivered: PropTypes.bool.isRequired, //Identifies if the message has been sent on Socket.io(true) or offline (false)
    read: PropTypes.bool.isRequired,
};


export default withStyles(notificationStyle) (Notification);