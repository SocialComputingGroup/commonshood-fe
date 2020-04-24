import React from 'react';

import Avatar from '@material-ui/core/Avatar'
import ListItemText from '@material-ui/core/ListItemText'
import CircularProgress from "@material-ui/core/CircularProgress";
import MenuItem from '@material-ui/core/MenuItem';

const coinSelectDetails = ({coin, iconData, balance, value, key, selected, onClick, ...rest}) => {
    let details = (<div>Loading...</div>);
    const coinDisabled = checkCoinDisabled(coin,balance);
    if (coin) {
        const {
            symbol,
            showCoinBalance,
        } = coin;

        let balanceComponent = null;
        if(showCoinBalance){
            balanceComponent = balance ?
                                <ListItemText secondary={balance} /> :
                                <CircularProgress color="secondary" disableShrink size={20}/>
        }
        details = (
            <MenuItem disabled={coinDisabled} value={value} key={key} selected={selected} onClick={onClick}>
                {iconData && iconData !== "data:application/octet-stream;base64," ? (
                    <Avatar alt={symbol} src={iconData} />
                ) : (
                    <Avatar alt={symbol}>{symbol}</Avatar>
                )}
                <ListItemText primary={symbol} />
                {balanceComponent}
            </MenuItem>
        )
    }
    return details;
}

const checkCoinDisabled = (coin, balance) => {
    let coinDisabled = false;
    if(!balance) {
        coinDisabled = true;
    } else if (balance <= 0) {
        coinDisabled = true;
    } else if (coin.state !=='confirmed' ) {
        coinDisabled = true;
    }
    return coinDisabled;
};

export default coinSelectDetails;