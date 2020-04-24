import React from 'react';
import {useTranslation } from 'react-i18next'; // hook

//Lazy loading for Code Splitting
import asyncComponent from '../../../hoc/AsyncComponent/AsyncComponent';

//Material-UI Components
// import Grid from "@material-ui/core/Grid";
// import Avatar from "@material-ui/core/Avatar";
// import Typography from "@material-ui/core/Typography";
// import Divider from "@material-ui/core/Divider";

//Custom components
//import AppIcon from '../../UI/AppIcon/AppIcon'

//Material Icon
import StarRate from '@material-ui/icons/StarRate'
import VerifiedUser from '@material-ui/icons/VerifiedUser'

//Style injections
import { withStyles } from "@material-ui/core/styles";
import coinDetailsStyle from "./ContactDetailsStyle";

import Tooltip from '@material-ui/core/Tooltip'
import Avatar from '@material-ui/core/Avatar';
import Badge from '@material-ui/core/Badge';

const FeaturedCard = asyncComponent(()=>import('../../UI/Card/FeaturedCard/FeaturedCard'));

//Material-UI Components
const Grid  = asyncComponent(()=>import( "@material-ui/core/Grid"));
// const Avatar = asyncComponent(()=>import( "@material-ui/core/Avatar"));
const Typography = asyncComponent(()=>import( "@material-ui/core/Typography"));
const Divider = asyncComponent(()=>import( "@material-ui/core/Divider"));
// const Tooltip = asyncComponent(()=>import("@material-ui/core/Tooltip"));
//const Badge = asyncComponent(()=>import("@material-ui/core/Badge"));


const coinDetails = props => {
    const {t, i18n} = useTranslation('ContactDetails');

    const {
        classes,
        children
    } = props;

    const  avatar = (
        <Avatar
            alt={children.name}
            src={children.icon}
            className={classes.avatar}
         />
    );

    const favoriteAvatar = (
        <Badge
            classes = {{
                badge: classes.favoritePosition
            }}
            // badgeContent={<AppIcon
            //     color="primary"
            //     classes={{
            //         colorPrimary: classes.favorite
            //     }}
            //     icon={{font:'material', name:'star_rate'}}
            // />}
            badgeContent={<StarRate color="primary" classes={{colorPrimary: classes.favorite}}/>}
        >
            {avatar}
        </Badge>
    );

    return (
        <FeaturedCard title={'Details about ' + children.name}>
        <Grid className={classes.mainpadding} container spacing={2}>
            <Grid item xs={6} className={classes.margintop}>
                {children.favorite ? favoriteAvatar : avatar }
            </Grid>
            <Grid item xs={6} className={classes.margintop}>
                <Typography align="right" variant="subtitle2">
                    {children.category} {children.verified
                    ? <VerifiedUser color="primary" />
                    //<AppIcon color="primary" icon={{font:'material', name:'verified_user'}}/>
                    : null}
                </Typography>
            </Grid>
            <Divider />
            <Grid item xs={12}>
                <Typography
                    gutterBottom={true}
                    align="left"
                    variant="subtitle2"
                    component="h2"
                >
                    {t('description')}:
                </Typography>
                <Typography paragraph={true} style={{display: 'flex', textAlign:'justify'}} >
                    { children.description}
                </Typography>
            </Grid>
        </Grid>
        </FeaturedCard>
    );
};

export default withStyles(coinDetailsStyle)(coinDetails);


