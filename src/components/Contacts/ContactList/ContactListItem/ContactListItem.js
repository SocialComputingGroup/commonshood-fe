import React from "react";

import Grid from '@material-ui/core/Grid';
//Lazy loading for Code Splitting
import asyncComponent from '../../../../hoc/AsyncComponent/AsyncComponent';
//Material Icons
import Room from '@material-ui/icons/Room';
import SwapHoriz from '@material-ui/icons/SwapHoriz';

//Style injections
import { withStyles } from "@material-ui/core/styles";
import contactListItemStyle from "./contactListItemStyle";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";


//i18n
import {useTranslation} from "react-i18next";

//Material-UI Components (Lazy loaded)
const ListItem = asyncComponent(()=>import ("@material-ui/core/ListItem"));
const ListItemText = asyncComponent(()=>import ("@material-ui/core/ListItemText"));
const Avatar = asyncComponent(()=>import ("@material-ui/core/Avatar"));
const IconButton = asyncComponent(()=>import ("@material-ui/core/IconButton"));
const Typography = asyncComponent(()=>import ('@material-ui/core/Typography'));

const ContactListItem = props => {

    const {
        name,
        icon,
        near,
        category,
        handleSelect,
        email,
        classes,
        distance,
        mostContacted,
        locatePLace,
        coordinates
    } = props;

    const { t } = useTranslation('ContactListItem');
    let nearTooltip = null;
    let distanceText = null;
    let mostContactedIcon = null;
    if (near) {
        distanceText = distance < 1000 ? distance+"\xa0m" : Math.round(distance/100) /10 + "\xa0Km";
        nearTooltip = ( //overwriting default css of listItemSecondaryAction is important
                <ListItemSecondaryAction style={{position: "relative", margin: "auto", right: 0, transform: "none"}} >
                    <IconButton onClick={(e) =>{ e.stopPropagation(); locatePLace(coordinates)}}>
                        <Room />
                    </IconButton>
                </ListItemSecondaryAction>
        );
    }

    if (mostContacted) {
        mostContactedIcon = (
            <SwapHoriz />
        );
    }

    const mainName = (
        <Typography variant="subtitle2" className={classes.mainName}>
            <span>{name}</span>
        </Typography>
    );

    const avatar = (
            <Avatar src={icon} alt={name} style={{marginRight: '10px'}}/>
    );

    let listItemText = null;
    if(category === 'FL_PLACES' ){ //DAO
        listItemText = <ListItemText primary={mainName} secondary={t('isDistant', {params:{distanceText: distanceText}}) }/>;
    }else{ //PERSON
        //listItemText = <ListItemText primary={mainName} secondary={t('userCategory')} />
        listItemText = <ListItemText primary={mainName} secondary={email ? `${email}` : null}/>
    }

    return (
        <ListItem button onClick={handleSelect} style={{paddingLeft: 0, paddingRight: 0}}>
            <Grid container alignContent="space-between" direction="row" alignItems="center">
                <Grid item xs={2} md={1} align="center">
                    {avatar}
                </Grid>
                <Grid item xs={8} md={10}>
                    {listItemText}
                </Grid>
                <Grid item xs={2} md={1} align="center">
                    {nearTooltip}{mostContactedIcon}
                </Grid>
            </Grid>
        </ListItem>
    );
};

export default withStyles(contactListItemStyle)(ContactListItem);
