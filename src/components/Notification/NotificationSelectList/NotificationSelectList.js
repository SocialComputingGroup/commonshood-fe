import React, {Component} from 'react';

//Material-UI components
import Checkbox from '@material-ui/core/Checkbox';
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItem from "@material-ui/core/ListItem";

//Custom components
import Notification from '../Notification';

//Configuration
import notificationConfig from "../../../config/notificationConfig";


class NotificationSelectList extends Component {

    state = {
        selectedMessages: []
    };

    handleSelect = id => event => {
        let newSelection = [...this.state.selectedMessages];
        if (event.target.checked) {
            newSelection.push(id)
        } else {
            newSelection.splice(newSelection.findIndex((item)=> item === id),1);
        }
        this.setState({selectedMessages: [...newSelection]});
    };

    render() {

        const {
            children
        } = this.props;

        return children.map((item, index) => {
            return (
                <ListItem key={index}>
                    {item.type ?
                        <ListItemIcon
                            >{notificationConfig.categories[item.type]}</ListItemIcon>
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
                    <Checkbox
                        value={item.id}
                        checked={this.state.selectedMessages.find((msg => item.id === msg.id))}
                        onChange={this.handleSelect(item.id)}/>

                </ListItem>
                    )
                });

    }
}

export default NotificationSelectList;