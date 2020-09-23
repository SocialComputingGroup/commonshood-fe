import React, {useState} from 'react';
import { useTranslation } from 'react-i18next';

// Styles
import { withStyles } from "@material-ui/core/styles";
import PiggyCardStyle from "./PiggyCardStyle"

//Material UI Components
import { Button,
    Card, CardActions, CardActionArea, CardContent, CardMedia,
    Grid, Icon, IconButton, Typography } from "@material-ui/core";


//custom components
import CoinAvatarLabeled from '../../../../components/UI/CoinAvatarLabeled/CoinAvatarLabeled';
import {logger} from "../../../../utilities/winstonLogging/winstonInit";
import PiggyLoad from "./PiggyLoad/PiggyLoad";

import config from "../../../../config";

const PiggyCard = (props) => {

    const {
        classes,
        crowdsale,
        handleOpen,
    } = props;
    const {
        crowdsaleAddress,
        title,
        description,
        isOwnedByCurrentUserWallet,
        startDate,
        endDate,
        maxCap,
        totalReservations,
        photo,
        status,
        acceptRatio,
        tokenToAccept,
        tokenToAcceptAddr,
        tokenToAcceptLogo,
        giveRatio,
        tokenToGive,
        tokenToGiveAddr,
        tokenToGiveLogo,
        tokenToGiveBalance //note that this is the balance of the related token for the crowdsale's wallet!
    } = crowdsale;
    const { t } = useTranslation('PiggyCard');

    // we open a different modal if the crowdsale has not coupons loaded yet
    const [openPiggyLoad, setOpenPiggyLoad] = useState(false);

    // visually shows if the logged user ownes the crowdsale
    let ownedButton = null;
    if(isOwnedByCurrentUserWallet){
        ownedButton = ( 
            <Button variant="contained" component="div" color="default" className={classes.owned}>
                <Icon>vpn_key</Icon> OWNED
            </Button>
        );
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();

    //TODO add check on cap reach first? If reached crowdsale is over for sure
    let timeLeft = null;
    if(maxCap !== totalReservations) {
        if (today < start) { //crowdsale not started yet
            timeLeft = (start - today) / (1000 * 60 * 60 * 24);
            if (timeLeft < 1) {
                timeLeft = t('lessThanADayStart');
            } else {
                timeLeft = t('startingIn', {params: {days: Math.round(timeLeft)}});
            }
        } else { //crowdsale already started
            if (today < end) { //crowdsale already started but not ended
                timeLeft = (end - today) / (1000 * 60 * 60 * 24);
                if (timeLeft < 1) {
                    timeLeft = t('lessThanADayEnd');
                } else {
                    timeLeft = t('endingIn', {params: {days: Math.round(timeLeft)}});
                }
            } else { //crowdsale ended
                timeLeft = t('crowdsaleOver');
            }
        }
    }else{ //it doesn't matter the remaining time, crowdsale is already completed
       timeLeft = t("crowdsaleReachedCap");
    }

    //default case
    let iconButtons = (
        <>
            <IconButton disabled={true} className={classes.acceptedCoin}>
                <CoinAvatarLabeled noName={true} coin={ {symbol: tokenToAccept.symbol, logoFile: tokenToAcceptLogo}} />
                <Typography style={{color: "grey"}} variant="caption">{acceptRatio + ' ' + tokenToAccept.symbol}</Typography>
            </IconButton>
            <Icon disabled>compare_arrows</Icon>
            <IconButton disabled={true} className={classes.coinToGive}>
                <CoinAvatarLabeled noName={true} coin={ {symbol: tokenToGive.symbol, logoFile: tokenToGiveLogo}} />
                <Typography style={{color: "grey"}} variant="caption">{giveRatio + ' ' + tokenToGive.symbol}</Typography>
            </IconButton>
        </>
    );

    logger.info(`Crowdsale ${title} has a balance of ${tokenToGiveBalance.balance}`);
    logger.info("  \--> it requires: ", parseInt(maxCap/acceptRatio));

    if(tokenToGiveBalance.balance < parseInt(maxCap/acceptRatio) ){ //this crowdsale has not enough coupons loaded yet
        iconButtons = (
                <Grid container direction="column" justify="center" alignItems="center">
                    <Grid item>
                        <Typography color="error" variant="caption">
                            {t('couponsNotLoaded',
                                {params: {
                                    total: parseInt(maxCap/acceptRatio) - tokenToGiveBalance.balance,
                                    symbol: tokenToGive.symbol
                                }}
                            )}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" color="primary" onClick={() => setOpenPiggyLoad(true)}>
                            {t("loadCrowdsaleButton")}
                        </Button>
                        <PiggyLoad
                            open={openPiggyLoad}
                            handleClose={() => setOpenPiggyLoad(false)}
                            tokenToGive={tokenToGive}
                            tokenToGiveAddr={tokenToGiveAddr}
                            tokenToGiveCrowdsaleBalance={tokenToGiveBalance.balance}
                            tokenToGiveDecimals={tokenToGiveBalance.decimals}
                            tokenToGiveTotalNeeded={ parseInt(maxCap/acceptRatio) }
                            crowdsaleAddress={crowdsaleAddress}
                        />
                    </Grid>
                </Grid>
            );
    }else{ //crowdsale has enough coupons loaded
        if(status === config.crowdsaleStatus[2]){ //crowdsale is still LOCKED
            iconButtons = (
                <Grid container direction="column" justify="center" alignItems="center">
                    <Grid item>
                        <Typography color="error" variant="caption">
                            {t('couponsLoaded')}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" color="primary" onClick={() => setOpenPiggyLoad(true)}>
                            {t("unlockCrowdsaleButton")}
                        </Button>
                        <PiggyLoad
                            open={openPiggyLoad}
                            handleClose={() => setOpenPiggyLoad(false)}
                            tokenToGive={tokenToGive}
                            tokenToGiveAddr={tokenToGiveAddr}
                            tokenToGiveCrowdsaleBalance={tokenToGiveBalance.balance}
                            tokenToGiveDecimals={tokenToGiveBalance.decimals}
                            tokenToGiveTotalNeeded={ parseInt(maxCap/acceptRatio) }
                            crowdsaleAddress={crowdsaleAddress}
                        />
                    </Grid>
                </Grid>
            )
        }
    }

    return (
        <Card className={classes.card}>
            <CardActionArea>
                <CardMedia
                    className={classes.media}
                    image={photo.body}
                    title={title}
                    onClick={handleOpen}
                />
                { ownedButton }

                <CardContent  onClick={handleOpen}>
                    <Typography component="p" >
                        {title}
                    </Typography>
                    <Typography variant="overline" style={{textAlign: 'center', display: 'block'}} >
                        {timeLeft}
                    </Typography>
                    <Typography variant="caption" style={{textAlign: 'center', display: 'block', color: 'gray'}} >
                        {t('currentlyRaised',
                            {params:
                                    {
                                        raised: totalReservations,
                                        cap: maxCap,
                                        ticker: tokenToAccept.symbol
                                    }
                            })
                        }
                    </Typography>
                </CardContent>
            </CardActionArea>
            <CardActions className={classes.actions}>
                {iconButtons}
            </CardActions>
        </Card>
    );
}

export default withStyles(PiggyCardStyle)(PiggyCard);
  