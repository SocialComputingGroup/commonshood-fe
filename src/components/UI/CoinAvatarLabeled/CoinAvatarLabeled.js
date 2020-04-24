import React from 'react';

import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';

const CoinAvatarLabeled = (props) =>{
    if(!props.coin)
        return null;

    let name = null;
    if(!props.noName){
        name = (
            <Grid item xs={3} md={3} lg={2}>
                <Typography variant="body1">
                    {props.coin.name}
                </Typography>
            </Grid>
        ) 
    }
    return (
        <Grid container justify="center" alignItems="center"  >
            <Grid item xs={12}>
                <Avatar
                    alt={props.coin.symbol}
                    src={props.coin.logoFile}
                />
            </Grid>
            {name}
        </Grid>
    );
}

export default CoinAvatarLabeled;