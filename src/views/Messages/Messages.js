// View for List of Messages
import React, {Component} from 'react';

//Redux connection
import { connect } from 'react-redux';
import * as actions from "../../store/actions";
import {withTranslation} from "react-i18next";

import getNotificationText from '../../utilities/notification/notification-messages';
import { ListItem, ListItemText } from '@material-ui/core';


class Messages extends Component {

    state ={
        localMsgList: null
    };

    componentDidMount () {
        this.props.onNotificationsGetList(localStorage.getItem('userId'));
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        if(JSON.stringify(this.props.notificationsList) === JSON.stringify(nextProps.notificationsList)){
            return false;
        }
        return true;
    }

    render() {
        const {
            notificationsList,
            t
        } = this.props;
        let messageString = '';
        let localNotificationList = [];
        if(notificationsList && notificationsList.length > 0) {
             localNotificationList = notificationsList.reverse().map((item,index) =>{
                 messageString = getNotificationText(item.body.message.message_key, item.body.message.params, item.type, t);
                 return (
                    <ListItem key={index}>
                        <ListItemText primary ={messageString} secondary = {new Date(item.timestamp).toLocaleString()}/>
                    </ListItem>
                 )
            });
        }
        return (
            <div>
                {localNotificationList}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        allNotificationsLoading: state.notification.loadingTransactions,
        notificationsList: state.notification.notifications,
       
    }
  };
  
  
  const mapDispatchToProps = dispatch => {
    return {
        onNotificationsGetList: (userId) => dispatch(actions.notificationGetAllMine())
    }
  };

export default connect(mapStateToProps,mapDispatchToProps)(withTranslation('NotificationMessages')(Messages));