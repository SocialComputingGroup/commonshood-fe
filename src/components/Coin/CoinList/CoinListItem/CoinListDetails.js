import React from 'react';
import { connect } from 'react-redux';

import {coinListItemStyle} from "./coinListItemStyle"
import withStyles from "@material-ui/core/styles/withStyles"
import asyncComponent from "../../../../hoc/AsyncComponent/AsyncComponent";

import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

//i18n
import {withTranslation} from "react-i18next";

import CircularProgress from '@material-ui/core/CircularProgress';

import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import * as actions from "../../../../store/actions";

import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Typography from "@material-ui/core/Typography";
const ListItem = asyncComponent(() => import ("@material-ui/core/ListItem"));
//const MenuItem = asyncComponent(() => import ("@material-ui/core/MenuItem"));
const ListItemText = asyncComponent(() => import ("@material-ui/core/ListItemText"));
const ListItemSecondaryAction = asyncComponent(() => import ("@material-ui/core/ListItemSecondaryAction"));
const Avatar = asyncComponent(() => import ("@material-ui/core/Avatar"));
const Radio = asyncComponent(()=> import ('@material-ui/core/Radio'));

//const MiniLoader = asyncComponent(()=> import ('../../../UI/Loading/MiniLoader'))

const CoinListDetails = (props) => {


    const { 
        coin,
        withRadio,
        classes,
        selected,
        handleSelect,
        iconData,
        t,
        balance,
        currentProfileId,
        showPayButton
    } = props;
    
    const {
        id,
        name,
        symbol,
    } = coin;

    //material ui breakpoint handler
    const theme = useTheme();
    const matchesBelowSm = useMediaQuery(theme.breakpoints.down('sm'));

    const handlePay = () => {
        const ticker = props.coin.symbol;
        const icon = props.iconData;
        const type = props.coin.type; //token or goods
        const address = props.coin.address;
        props.onSetPreselectedCoin({ticker, icon, type, address});
        props.onBottomMenuIndexChange(0); //bring user back to coinSend
    };

    let fullName = name + " | " + symbol;
    if(matchesBelowSm){
        fullName = symbol;
    }

    const coinDisabled = checkCoinDisabled(coin, balance);
    const ownerString = currentProfileId === coin.userId ? t('owned') : null;

    // let primaryListText = (
    //     <Grid container direction="column">
    //         <Grid item>
    //             <Typography>
    //                 {fullName}
    //             </Typography>
    //         </Grid>
    //         <Grid item>
    //             <Typography color="gray" variant="caption">
    //                 {ownerString}
    //             </Typography>
    //         </Grid>
    //     </Grid>
    // );

    return (
        <Grid container alignItems="center">
            <Grid item xs={12}>
            <ListItem dense
                className={classes.item}
                button
                onClick={handleSelect}
                disabled={coinDisabled}
                selected={selected}
            >
                { (iconData && iconData !== "data:application/octet-stream;base64,") ?
                    <Avatar
                        alt={symbol}
                        src={iconData}
                        className={classes.avatar}
                    />
                    :
                    <Avatar alt={symbol} className={classes.avatar}>{symbol}</Avatar>
                }
                <ListItemText primary={fullName} secondary={ownerString}/>
                {
                    balance >= 0 ?
                    <ListItemText
                        primary={balance}
                        className={showPayButton ? classes.balanceTextWithPay : classes.balanceText}
                    />
                    : <CircularProgress color="secondary"
                                        disableShrink size={20}
                                        className={
                                            withRadio ?
                                                classes.withRadioBalanceText :
                                                classes.balanceTextWithPay
                                        }/>
                }

                {/*<ListItemIcon style={{padding: '0 0.5em'}}>*/}

                {/*<AppIcon icon={{font: "material", name: "bar_chart"}}/>*/}

                {withRadio
                    ?
                    <ListItemSecondaryAction>
                        <Radio
                            id={id}
                            name={id}
                            value={symbol}
                            onChange={handleSelect}
                            checked={selected}
                        />
                    </ListItemSecondaryAction>
                    :
                    <ListItemSecondaryAction>
                        <Button
                        variant="contained"
                        color="primary"
                        disabled={coinDisabled || balance <= 0}
                        onClick={handlePay}
                        >
                            {t('Common:pay')}
                        </Button>
                    </ListItemSecondaryAction>
                }
            </ListItem>
            </Grid>
            {/*{payButton}*/}
        </Grid>
    );
};

const checkCoinDisabled = (coin, balance) => {
    if(balance == null || balance == -1) {
        return true;
    }
    return false;
}


const mapStateToProps = state => {
    return {
        currentProfileId: state.user.currentProfile.id,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onSetPreselectedCoin: (coin) => dispatch(actions.coinSetPreselected(coin)),
        onBottomMenuIndexChange: (index) => dispatch(actions.handleBottomMenuIndexChange(index)),
    }
};

export default withStyles(coinListItemStyle) (withTranslation('CoinListDetails')( connect(mapStateToProps, mapDispatchToProps)(CoinListDetails)));