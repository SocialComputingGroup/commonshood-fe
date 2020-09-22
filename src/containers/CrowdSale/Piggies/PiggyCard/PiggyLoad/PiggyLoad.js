import React, {useState, useEffect} from 'react';
import SlideModal from "../../../../../components/UI/Modal/SlideModal/SlideModal";

//material ui components
import { Button, Grid, Typography } from "@material-ui/core";

//api
import {coinGetBalance} from "../../../../../api/coinAPI";
import {loadCouponsInCrowdsale} from "../../../../../api/crowdsaleAPI";

//redux
import {connect} from "react-redux";

// translations
import {useTranslation} from "react-i18next";

//logger
import {logger} from "../../../../../utilities/winstonLogging/winstonInit";


const PiggyLoad = (props) => {
    const {
        crowdsaleAddress,

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

    const handleLoadClick = async() => {
        logger.info("userwallet", userWalletAddress);
        logger.info("cwd addr", crowdsaleAddress);
        logger.info("tokenaddr", tokenToGiveAddr);
        logger.info("amount", couponsNeeded);
        logger.info("decimals", tokenToGiveDecimals);
        const successfullyLoaded = await loadCouponsInCrowdsale(web3Instance, userWalletAddress, crowdsaleAddress, tokenToGiveAddr, couponsNeeded, tokenToGiveDecimals);
        if(successfullyLoaded){
            setLoaded(true);
        }
    }


    let notEnoughCouponsComponent = null;
    let loadButton = null;
    if( userBalance - couponsNeeded < 0){
        logger.info("[PIGGYLOAD] user has ÑOT enough coupons to load cwd");
        notEnoughCouponsComponent = (
            <Typography color="error" style={{marginTop: "1em"}}>{t('notEnough',
                {
                    params: {
                        symbol: tokenToGive.symbol
                    }
                }
            )}</Typography>
        )
    }else{
        logger.info("[PIGGYLOAD] user has enough coupons to load cwd");
        loadButton = (
            <Button
                variant="contained"
                color="primary"
                style={{marginTop: "1em"}}
                onClick={handleLoadClick}>
                {t('loadButton',
                    {
                        params:{
                            quantity: couponsNeeded,
                            symbol: tokenToGive.symbol,
                        }
                    }
                )}
            </Button>
        )
    }





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
                    <Typography>{t('couponsNeeded',
                        {
                            params: {
                                quantity: tokenToGiveTotalNeeded - tokenToGiveCrowdsaleBalance,
                                symbol: tokenToGive.symbol,
                            }
                        }
                    )}</Typography>
                </Grid>
                <Grid item>
                    <Typography>{t('couponsUserHas',
                        {
                            params: {
                                quantity: userBalance,
                                symbol: tokenToGive.symbol,
                            }
                        }
                    )}</Typography>
                </Grid>
                <Grid item>
                    {notEnoughCouponsComponent}
                </Grid>
                <Grid item>
                    {loadButton}
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
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(PiggyLoad);
