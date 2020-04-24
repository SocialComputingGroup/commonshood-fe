import React from 'react';
import ReactCountryFlag from 'react-country-flag';

import asyncComponent from "../../../../hoc/AsyncComponent/AsyncComponent";
const ListItem = asyncComponent(()=>import('@material-ui/core/ListItem'));
const ListItemIcon = asyncComponent(()=>import('@material-ui/core/ListItemIcon'));

const FlagButton = (props) => {

    const handleClick = () =>{
        props.i18n.changeLanguage(props.lngISO);
    };

    return(
        <ListItem
            button
            onClick={handleClick}
        >
            <ListItemIcon>
                <ReactCountryFlag code={props.countryAcronym} alt={props.countryAcronym} svg />
            </ListItemIcon>
        </ListItem>
    )
};

export default FlagButton;