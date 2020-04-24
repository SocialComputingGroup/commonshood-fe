import React from 'react';

//Lazy loading for Code Splitting
import asyncComponent from '../../../../hoc/AsyncComponent/AsyncComponent';

//import AppIcon from '../../AppIcon/AppIcon'
//Case changer

import { listIntoArray } from "../../../../utilities/utilities";

//Material-UI
const List = asyncComponent(()=>import('@material-ui/core/List'));
const ListItem = asyncComponent(()=>import('@material-ui/core/ListItem'));
const ListItemIcon = asyncComponent(()=>import('@material-ui/core/ListItemIcon'));
const ListItemText = asyncComponent(()=>import('@material-ui/core/ListItemText'));
const Typography = asyncComponent(()=>import('@material-ui/core/Typography'));


const ListMenu = ({disableConcurrent, ...props}) => {

    const arr = listIntoArray(props.children);

    return (
        <List component="nav">
            {
                arr.map((item, key) => {
                    return (
                        <ListItem
                            disabled = {disableConcurrent && item.concurrent}
                            button
                            key={key}
                            onClick={item.path ? ()=>props.navHandler(item.path) : null} >
                            <ListItemIcon>
                                {/*<AppIcon icon={item.icon}/>*/}
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText>
                                <Typography>{item.text}</Typography>
                            </ListItemText>

                            {/*<Link to={item.path}/>*/}
                        </ListItem>
                    )
                })
            }
            </List>
    )
};

ListMenu.propTypes = {
    
};

export default ListMenu;
