import React, {useState, useEffect} from 'react';

import Loading from "../../../../../components/UI/Loading/Loading";
import SlideModal from "../../../../../components/UI/Modal/SlideModal/SlideModal";

//material ui components
import { Button, Grid, Typography } from "@material-ui/core";

//api
import {coinGetBalance} from "../../../../../api/coinAPI";
import {loadCouponsInCrowdsale, unlockCrowdsale} from "../../../../../api/crowdsaleAPI";

//redux
import {connect} from "react-redux";

// translations
import {useTranslation} from "react-i18next";

//logger
import {logger} from "../../../../../utilities/winstonLogging/winstonInit";
import * as actions from "../../../../../store/actions";


const PiggyLoad = (props) => {
    const {
        crowdsaleAddress,

        crowdsalesReload,

        open,
        handleClose,
        tokenToGive,
        tokenToGiveAddr,
        tokenToGiveCrowdsaleBalance,
        tokenToGiveDecimals,
        tokenToGiveTotalNeeded,

        userWalletAddress,
        web3Instance
    } = props;
    const [ userBalance, setUserBalance ] = useState(0);
    const couponsNeeded = tokenToGiveTotalNeeded - tokenToGiveCrowdsaleBalance;
    const [ loaded, setLoaded ] = useState(couponsNeeded === 0 );
    const [ showLoadingComponent, setShowLoadingComponent ] = useState(false);
    const { t } = useTranslation('PiggyLoad');

    useEffect( () => {
        async function loadBalance(){
            const result = await coinGetBalance(web3Instance, userWalletAddress, tokenToGiveAddr);
            setUserBalance(result.balance);
        }
        if(tokenToGive != null) {
            loadBalance();
        }
    }, [tokenToGive, loaded]);

    const handleLoadClick = async () => {
        // logger.info("userwallet", userWalletAddress);
        // logger.info("cwd addr", crowdsaleAddress);
        // logger.info("tokenaddr", tokenToGiveAddr);
        // logger.info("amount", couponsNeeded);
        // logger.info("decimals", tokenToGiveDecimals);
        setShowLoadingComponent(true)
        const successfullyLoaded = await loadCouponsInCrowdsale(web3Instance, userWalletAddress, crowdsaleAddress, tokenToGiveAddr, couponsNeeded, tokenToGiveDecimals);
        if(successfullyLoaded){
            setLoaded(true);
            crowdsalesReload();
        }
        setShowLoadingComponent(false);
    }

    const handleUnlockClick = async () => {
        setShowLoadingComponent(true);
        const successfullyUnlocked = await unlockCrowdsale(web3Instance, userWalletAddress, crowdsaleAddress);
        if(successfullyUnlocked){
            crowdsalesReload();
        }
        setShowLoadingComponent(false);
    }

    //ui elements
    let couponsNeededTypography = null;
    let couponsPossessedTypography = null;
    let couponsInfoTypography = null;
    let actionButton = null;
    if(couponsNeeded > 0) { //this crowdsale has not been loaded yet
        couponsInfoTypography = (
            <Typography>{t('couponsNeeded',
                {
                    params: {
                        quantity: tokenToGiveTotalNeeded - tokenToGiveCrowdsaleBalance,
                        symbol: tokenToGive.symbol,
                    }
                }
            )}</Typography>
        );
        couponsPossessedTypography = (
            <Typography>{t('couponsUserHas',
                {
                    params: {
                        quantity: userBalance,
                        symbol: tokenToGive.symbol,
                    }
                }
            )}</Typography>
        );


        if (userBalance - couponsNeeded < 0) {
            logger.info("[PIGGYLOAD] user has NOT enough coupons to load cwd");
            couponsInfoTypography = (
                <Typography color="error" style={{marginTop: "1em"}}>{t('notEnough',
                    {
                        params: {
                            symbol: tokenToGive.symbol
                        }
                    }
                )}</Typography>
            )
        } else {
            logger.info("[PIGGYLOAD] user has enough coupons to load cwd");
            if(!showLoadingComponent) {
                actionButton = (
                    <Button
                        variant="contained"
                        color="primary"
                        style={{marginTop: "1em"}}
                        onClick={handleLoadClick}>
                        {t('loadButton',
                            {
                                params: {
                                    quantity: couponsNeeded,
                                    symbol: tokenToGive.symbol,
                                }
                            }
                        )}
                    </Button>
                )
            }
        }
    }else{//this crowdsale is already loaded!
        couponsInfoTypography = (
            <Typography color="error" style={{marginTop: "1em"}}>{t('unlockMessage')}</Typography>
        )
        if(!showLoadingComponent) { //no transaction pending
            actionButton = (
                <Button
                    variant="contained"
                    color="primary"
                    style={{marginTop: "1em"}}
                    onClick={handleUnlockClick}>
                    {t('unlockButton')}
                </Button>
            );
        }
    }

    const loadingTransactionComponent = (
        <Loading title={t("waitingTransaction")} withLoader />
    );

    return (
        <SlideModal
            fullscreen={false}
            open={open}
            handleClose={() => handleClose()}
            title={t("piggyLoadTitle")}
        >
            <Grid container
                  direction="column"
                  justify="center"
                  alignItems="center"
                  style={{margin: "2em 0", padding: "0 2em"}}
            >
                <Grid item>
                    {couponsNeededTypography}
                </Grid>
                <Grid item>
                    {couponsPossessedTypography}
                </Grid>
                <Grid item>
                    {couponsInfoTypography}
                </Grid>
                <Grid item>
                    {actionButton}
                </Grid>
                <Grid item>
                    {showLoadingComponent ? loadingTransactionComponent : null}
                </Grid>
            </Grid>
        </SlideModal>
    );
};

const mapStateToProps = state => {
    return{
        userWalletAddress: state.web3.currentAccount,
        web3Instance: state.web3.web3Instance,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        crowdsalesReload: () => dispatch(actions.crowdsaleGetAll()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PiggyLoad);
