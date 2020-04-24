import React from 'react';

//Material-UI Components
import Menu from "@material-ui/core/Menu"
import MenuItem from "@material-ui/core/MenuItem"
import ListItemIcon from "@material-ui/core/ListItemIcon";

//style injection
import { withStyles } from "@material-ui/core/styles";
import notificationMenuListStyle from './NotificationMenuListStyle'

//Custom components
import Notification from '../Notification'
//import ListItemIcon from "@material-ui/core/ListItemIcon";

import notificationConfig from '../../../config/notificationConfig';

const NotificationMenuList = (props) => {
    const { 
        notificationList, 
        onClickOnNotification, 
        id, 
        anchorEl, 
        anchorOrigin, 
        transformOrigin, 
        open, 
        onEmpty, 
        classes} = props;

    return (
        <Menu
            id={id}
            anchorEl={anchorEl}
            anchorOrigin={anchorOrigin}
            transformOrigin={transformOrigin}
            open={open}
            onClose={onEmpty}
        >
            {notificationList.map ((item,index) => {

                return (
                    //<MenuItem key={index} onClick={onClose}>
                    <MenuItem key={index} onClick={ (event) => onClickOnNotification(event, item)}>
                        {item.type ?
                            <ListItemIcon className={classes.icon}>{notificationConfig.categories[item.type]}</ListItemIcon>
                            : <ListItemIcon>{notificationConfig.categories.info}</ListItemIcon>
                        }

                        <Notification
                            id={index}
                            type={item.type}
                            timestamp={new Date(item.timestamp)}
                            body={item.body}
                            delivered={item.delivered}
                            read={item.read}
                        />

                    </MenuItem>
                    )
            })}
        </Menu>
    )
}

export default withStyles(notificationMenuListStyle)(NotificationMenuList);