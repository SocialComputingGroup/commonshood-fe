import React, {useState} from 'react';
import { useTranslation } from 'react-i18next';

// Styles
import { withStyles } from "@material-ui/core/styles";
import PiggyCardStyle from "./PiggyCardStyle"

//Material UI Components
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Icon from "@material-ui/core/Icon";
import Button from "@material-ui/core/Button";

//custom components
import CoinAvatarLabeled from '../../../../components/UI/CoinAvatarLabeled/CoinAvatarLabeled';
import {logger} from "../../../../utilities/winstonLogging/winstonInit";
import PiggyLoad from "./PiggyLoad/PiggyLoad";



const PiggyCard = (props) => {

    const {
        classes,
        crowdsale,
        handleOpen,
    } = props;
    const {
        title,
        description,
        isOwnedByCurrentUserWallet,
        startDate,
        endDate,
        maxCap,
        totalReservations,
        photo,
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
    if(tokenToGiveBalance !== 0){ //the coupons of this crowdsale have not be loaded yet!
        iconButtons = (
            <>
                <Typography style={{color: "grey"}} variant="caption">
                    {t('couponsNotLoaded',
                        {params: {
                            total: tokenToGiveBalance.balance,
                            symbol: tokenToGive.symbol
                        }}
                    )}
                </Typography>
                <Typography style={{color: "grey"}} variant="caption">
                    {t('couponsNotLoaded',
                        {params: {
                                total: tokenToGiveBalance.balance,
                                symbol: tokenToGive.symbol
                            }}
                    )}
                </Typography>
                <Button variant="contained" color="primary" onClick={() => setOpenPiggyLoad(true)}>
                    Transfer Coupon
                </Button>
                <PiggyLoad
                    open={openPiggyLoad}
                    handleClose={() => setOpenPiggyLoad(false)}
                    tokenToGive={tokenToGive}
                    tokenToGiveAddr={tokenToGiveAddr}
                    tokenToGiveCrowdsaleBalance={tokenToGiveBalance.balance}
                />
            </>
            );
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
  