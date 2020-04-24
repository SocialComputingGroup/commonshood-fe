import React from 'react';
import PropTypes from "prop-types";
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

import CoinAvatarLabeled from '../../../../components/UI/CoinAvatarLabeled/CoinAvatarLabeled';



const PiggyCard = (props) => {

    const {
        image,
        title,
        handleOpen,
        acceptedCoin,
        acceptedCoinRatio,
        coinToGive,
        coinToGiveRatio,
        totalReservations,
        startDate,
        endDate,
        maxCap,
        owned,
        acceptedCoinLogo,
        coinToGiveLogo,
        classes
    } = props;
    let ownedButton = null;
    
    const { t } = useTranslation('PiggyCard');

    if(owned){
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

    return (
        <Card className={classes.card}>
            <CardActionArea>
                <CardMedia
                    className={classes.media}
                    image={image}
                    title={title}
                    onClick={handleOpen}
                />
                {/*<Fab size="small" className={classes.favorite}>*/}
                {/*    <Icon color="error">favorite</Icon>*/}
                {/*</Fab>*/}
                { 
                    ownedButton
                }

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
                                        ticker: acceptedCoin
                                    }
                            })
                        }
                    </Typography>
                </CardContent>
            </CardActionArea>
            <CardActions className={classes.actions}>
                {/* <Icon>room</Icon> */}
                {/* <Typography variant="caption">{distance} m</Typography> */}
                <IconButton disabled={true} className={classes.acceptedCoin}>
                    {/* <Icon>attach_money</Icon> */}
                    <CoinAvatarLabeled noName={true} coin={ {symbol: acceptedCoin, logoFile: acceptedCoinLogo}} />
                    <Typography style={{color: "grey"}} variant="caption">{acceptedCoinRatio + ' ' + acceptedCoin}</Typography>
                </IconButton>
                <Icon disabled>compare_arrows</Icon>
                <IconButton disabled={true} className={classes.coinToGive}>
                    {/* <Icon>style</Icon> */}
                    <CoinAvatarLabeled noName={true} coin={ {symbol: coinToGive, logoFile: coinToGiveLogo}} />
                    <Typography style={{color: "grey"}} variant="caption">{parseInt(coinToGiveRatio) + ' ' + coinToGive}</Typography>
                </IconButton>
            </CardActions>
        </Card>
    );
}

PiggyCard.propTypes = {
    classes: PropTypes.object.isRequired
};
  
export default withStyles(PiggyCardStyle)(PiggyCard);
  