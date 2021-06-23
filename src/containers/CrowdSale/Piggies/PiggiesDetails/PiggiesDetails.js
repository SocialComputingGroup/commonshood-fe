import React, {useState, useEffect} from "react";
import { connect } from 'react-redux';
import * as actions from "../../../../store/actions/index";
import {logger} from '../../../../utilities/winstonLogging/winstonInit';
import { base64ToArrayBuffer } from '../../../../utilities/utilities'
import {assetDecimalRepresentationToInteger, assetIntegerToDecimalRepresentation} from '../../../../utilities/decimalsHandler/decimalsHandler';

import config from '../../../../config';

//APIs
import {coinGetBalance} from '../../../../api/coinAPI';
import {crowdsaleGetReservationsOfAccount} from '../../../../api/crowdsaleAPI';

//styles
import { withStyles } from "@material-ui/core/styles";
import withWidth, { isWidthUp, isWidthDown } from '@material-ui/core/withWidth';
import piggiesDetailsStyle from './PiggiesDetailsStyle';

//i18n
import { useTranslation } from "react-i18next";

import {Button, Card, CardMedia, CardContent, CardActions, Grid, Icon, IconButton, Slide, Typography} from "@material-ui/core";

import SlideModal from '../../../../components/UI/Modal/SlideModal/SlideModal';
import PiggyBank from "./PiggyBank/PiggyBank";
import CoinAvatarLabeled from '../../../../components/UI/CoinAvatarLabeled/CoinAvatarLabeled';


//helper function to easily prepare TOS file for download
const downloadTOS = (TOSFileData) =>{
    let arrBuffer = base64ToArrayBuffer(TOSFileData.body);

    // It is necessary to create a new blob object with mime-type explicitly set
    // otherwise only Chrome works like it should
    let newBlob = new Blob([arrBuffer], { type: "application/pdf" });

    // IE doesn't allow using a blob object directly as link href
    // instead it is necessary to use msSaveOrOpenBlob
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(newBlob);
    } else {
        const data = window.URL.createObjectURL(newBlob);

        const link = document.createElement('a');
        document.body.appendChild(link); //required in FF, optional for Chrome
        link.href = data;
        link.target = '_self';
        link.download = TOSFileData.name;
        link.click();
        window.URL.revokeObjectURL(data);
        link.remove();
    }
};

const crowdsaleStatusEnum = config.crowdsaleStatus;

//helper function to compute time left before ending of the crowdsale
const TimeStatusEnum = Object.freeze({
    started: "started",
    ended: "ended",
    notStarted: "notStarted"
});
const computeTimeLeft = (startDate, endDate) => {
    const today = new Date();
    if(startDate < today) { // start date already passed
        if(endDate > today){ // and end date not reached
            const timeLeft = (endDate - today) / (1000 * 60 * 60 * 24); //days left from end
            logger.debug('PiggiesDetails -> TIMELEFT', timeLeft);
            return {
                timeStatus: TimeStatusEnum.started,
                timeLeft
            };
        }else{ //endDate already reached
            logger.debug('PiggiesDetails -> endDate not reached yet');
            return {
                timeStatus: TimeStatusEnum.ended,
                timeLeft: -1
            }
        }
    }else{ //startDate not reached yet
        logger.debug('PiggiesDetails -> startDate not reached yet');
        return {
            timeStatus: TimeStatusEnum.notStarted,
            timeLeft: -1,
        };
    }
}

const PiggiesDetails = (props) => {
    logger.debug('[crowdsale for this piggiedetail =>', crowdsale);
    const {
        closePiggieDetails,
        crowdsale,
        web3Instance,
        userWalletAddress,
        classes
    } = props;

    logger.info("crowdsale of this piggie =>", crowdsale);

    const {t} = useTranslation('PiggiesDetails');

    const [isPiggyBankOpen, setPiggyBankOpen] = useState(false);
    const [tokenToAcceptUserBalance, setTokenToAcceptUserBalance] = useState(0);
    const [userBalanceIsReady, setUserBalanceReady] = useState(false);
    const [userWalletReservations, setUserWalletReservations] = useState(0);
    const [areUserWalletReservationsLoaded, setUserWalletReservationsLoaded] = useState(false);

    useEffect( () => {
        async function getBalance(){
            let response = await coinGetBalance( web3Instance, userWalletAddress, crowdsale.tokenToAcceptAddr);
            setTokenToAcceptUserBalance(response.balance);
            setUserBalanceReady(true);
        }
        async function getReservations(){
            let reservations = await crowdsaleGetReservationsOfAccount(web3Instance, userWalletAddress, crowdsale.crowdsaleAddress);
            setUserWalletReservations(reservations);
            setUserWalletReservationsLoaded(true);
        }

        getBalance();
        getReservations();
    }, []);

    // This is just to avoid a race condition when closing the modal which removes the crowdsale passed as a
    // props but sometimes it does it before this component is unmounted causing a reference error
    if(!crowdsale){
        return null;
    }

    let timeLeftComponent = null;
    const crowdsaleTime = computeTimeLeft(crowdsale.startDate, crowdsale.endDate);
    //let's show the time left only if the crowdsale has not already reached cap:
    if(crowdsale.totalReservations >= crowdsale.maxCap){
        if(crowdsaleTime.timeStatus === TimeStatusEnum.ended){
            timeLeftComponent = (
                <CardActions className={classes.actions}>
                    <Grid container alignContent="space-between" direction="row">
                        <Grid item align={isWidthUp('sm', props.width) ? "right" : "center"} xs={12}>
                            <Icon className={classes.end}>alarm_on</Icon>
                            <Typography variant="caption">{t('crowdsaleEnded')}</Typography>
                        </Grid>
                    </Grid>
                </CardActions>
            )
        }else if(
            crowdsaleTime.timeStatus === TimeStatusEnum.started &&
            crowdsaleTime.timeLeft < 1 //less than a day
        ){
            timeLeftComponent = (
                <CardActions className={classes.actions}>
                    <Grid container alignContent="space-between" direction="row">
                        <Grid item align={isWidthUp('sm', props.width) ? "right" : "center"} xs={12}>
                            <Icon className={classes.end}>alarm_on</Icon>
                            <Typography variant="caption">{t('timeLeftLessThanADay')}</Typography>
                        </Grid>
                    </Grid>
                </CardActions>
            );
        }else if(crowdsaleTime.timeStatus === TimeStatusEnum.started){
            timeLeftComponent = (
                <CardActions className={classes.actions}>
                    <Grid container alignContent="space-between" direction="row">
                        <Grid item align={isWidthUp('sm', props.width) ? "right" : "center"} xs={12}>
                            <Icon className={classes.end}>alarm_on</Icon>
                            <Typography variant="caption">{t('timeLeft', {params: {days: Math.round(crowdsaleTime.timeLeft)}})}</Typography>
                        </Grid>
                    </Grid>
                </CardActions>
            );
        }else{ //crowdsale already ended
            timeLeftComponent = (
                <CardActions className={classes.actions}>
                    <Icon className={classes.end}>alarm_on</Icon>
                    <Typography variant="caption">{t('startingDateNotReachedYet')}</Typography>
                </CardActions>
            );
        }
    }

    //managing user-warning text:
    let warningText = "";
    let warningTypographyClass = classes.doNotShowWarningText;
    if(
        crowdsale.status === crowdsaleStatusEnum[1] || //stopped
        crowdsale.status === crowdsaleStatusEnum[2] //locked
    ){
        warningText = t('crowdsaleNotRunning');
        warningTypographyClass = classes.showWarningText;
    }else { //status running
        if (!crowdsale.isOwnedByCurrentUserWallet) {
            if (crowdsaleTime.timeStatus === TimeStatusEnum.notStarted) {
                warningText = t('startingDateNotReachedYet');
                warningTypographyClass = classes.showWarningText;
            } else { //cwd started
                if (crowdsaleTime.timeStatus === TimeStatusEnum.ended) {
                    if(areUserWalletReservationsLoaded && userWalletReservations > 0){ //reservations left that the user can get back
                        warningText = t('crowdsaleEndedWithReservationLeft');
                        warningTypographyClass = classes.showWarningText;
                    }else { //ended and user didn't joined
                        warningText = t('crowdsaleEnded');
                        warningTypographyClass = classes.showWarningText;
                    }
                } else if (userBalanceIsReady && tokenToAcceptUserBalance < crowdsale.acceptRatio) { //not enough coin to join
                    warningText = t('notEnoughCoinToJoin', {params: {ticker: crowdsale.tokenToAccept.symbol}});
                    warningTypographyClass = classes.showWarningText;
                }
            }
        } else { // crowdsale is owned by the logged user
            warningText = t('crowdsaleOwned');
            warningTypographyClass = classes.showWarningText;
        }
    }

    //pledge button DEactivation conditions check
    // console.log("1  === ", crowdsale.isOwnedByCurrentUserWallet);
    // console.log("2  === ", !crowdsale.isOwnedByCurrentUserWallet &&
    //     !crowdsaleTime.timeStatus !== TimeStatusEnum.started);
    // console.log("3  === ", !crowdsale.isOwnedByCurrentUserWallet &&
    //     crowdsaleTime.timeStatus === TimeStatusEnum.ended &&
    //     areUserWalletReservationsLoaded &&
    //     userWalletReservations <= 0);
    // console.log("4  === ", !crowdsale.isOwnedByCurrentUserWallet &&
    //     userBalanceIsReady &&
    //     tokenToAcceptUserBalance <= crowdsale.acceptRatio &&
    //     areUserWalletReservationsLoaded &&
    //     userWalletReservations <= 0);
    // console.log("5  === ", !crowdsale.isOwnedByCurrentUserWallet &&
    //     crowdsale.status !== crowdsaleStatusEnum[0] &&
    //     areUserWalletReservationsLoaded &&
    //     areUserWalletReservationsLoaded <= 0);
    //
    //====

    const pledgeButton = (
        <Button
            variant="contained"
            color="primary"
            className={classes.button}
            fullWidth
            disabled = { //disable this button if:
                crowdsale.isOwnedByCurrentUserWallet || // user is the owner, so cannot join
                (
                    !crowdsale.isOwnedByCurrentUserWallet &&
                    crowdsaleTime.timeStatus !== TimeStatusEnum.started) || //not started
                (
                    !crowdsale.isOwnedByCurrentUserWallet &&
                    crowdsaleTime.timeStatus === TimeStatusEnum.ended &&
                    areUserWalletReservationsLoaded &&
                    userWalletReservations <= 0 //crowdsale ended and user has not still reservations on it
                ) ||
                !userBalanceIsReady || //we are still waiting to get the balance of the user for the tokenToAccept
                (
                    !crowdsale.isOwnedByCurrentUserWallet &&
                    userBalanceIsReady &&
                    tokenToAcceptUserBalance <= crowdsale.acceptRatio &&
                    areUserWalletReservationsLoaded &&
                    userWalletReservations <= 0
                ) || //the user has not enough tokenToAccept to join nor reservation to refund
                (
                    !crowdsale.isOwnedByCurrentUserWallet &&
                    crowdsale.status !== crowdsaleStatusEnum[0] &&
                    areUserWalletReservationsLoaded &&
                    areUserWalletReservationsLoaded <= 0
                ) //allow refunds even after it stopped (business rule)
            }
            onClick = { () => {
                setPiggyBankOpen(true);
            }}
        >
            {t('pledge')}
        </Button>
    );

    let localeStartingDate = `${crowdsale.startDate.toLocaleString()}` ;
    let localeEndingDate =  `${crowdsale.endDate.toLocaleString()}`;

    let goalReached = null;
    if( crowdsale.totalReservations <= crowdsale.maxCap){
        goalReached = (
            <>
                <Icon className={classes.end}>trending_up</Icon>
                {t('goalReached', {params:
                        {
                            currentReservation: crowdsale.totalReservations,
                            threshold: crowdsale.maxCap,
                            ticker: crowdsale.tokenToAccept.symbol,
                        }
                })}
            </>
        );
    }
    // if we are over maxCap the remaining coin are not convertible in coupons anymore (coupons are over)
    // we use this value to allow the user to refund even at crowdsale over
    const maxJoinLeft = crowdsale.totalReservations >= crowdsale.maxCap ?
        0 :
        crowdsale.maxCap - crowdsale.totalReservations;

    //contract file
    const contractButton = (
        <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick = {() => {downloadTOS(crowdsale.TOS)}}
        >
            {t('downloadContract')}
        </Button>
    );

    let yourReservationMessage = null;
    if(!crowdsale.isOwnedByCurrentUserWallet && areUserWalletReservationsLoaded){
        if(userWalletReservations > 0) {
            const params = {params: { reservation: userWalletReservations, ticker: crowdsale.tokenToAccept.symbol}};
            yourReservationMessage =
                <Typography variant="overline" align="center" style={{display: 'block'}} >{t('youAlreadyJoined', params )}</Typography>
        }else{
            yourReservationMessage = <Typography variant="overline" align="center" style={{display: 'block'}}>{t('youHaveNotJoinedYet')}</Typography>
        }
    }

    const ownerName = crowdsale.ownerAddress;

    return (
        <>
            <Card square className={classes.card}>
                <CardMedia
                    component="img"
                    className={classes.media}
                    image={crowdsale.photo.body}
                    title={crowdsale.title}
                />
                {/*<Fab size="small" className={classes.favorite}>
                        <Icon color="error">favorite</Icon>
                        </Fab>*/}
                <CardContent>
                    <Typography paragraph>
                        {crowdsale.description}
                    </Typography>
                </CardContent>
                <CardActions className={classes.actions}>
                    <Grid container alignContent="space-between" direction="row">
                        <Grid item align={isWidthUp('sm', props.width) ? "left" : "center"} xs={12} sm={6}>
                            <Icon>calendar_today</Icon>
                            <Typography variant="caption">{`${t('starting')}: ${localeStartingDate}`}</Typography>
                        </Grid>
                        <Grid item align={isWidthUp('sm', props.width) ? "right" : "center"} xs={12} sm={6}>
                            <Icon className={classes.end}>calendar_today</Icon>
                            <Typography variant="caption">{`${t('ending')}: ${localeEndingDate}`}</Typography>
                        </Grid>
                    </Grid>
                </CardActions>
                {timeLeftComponent}
                <CardActions className={classes.actions}>
                    <Grid container alignContent="space-between" direction="row">
                        <Grid item align={isWidthUp('sm', props.width) ? "left" : "center"} xs={12} sm={6}>
                            <Typography>{t('owner')}: {ownerName} </Typography>
                        </Grid>
                        <Grid item align={isWidthUp('sm', props.width) ? "right" : "center"} xs={12} sm={6}>
                            <Typography className={classes.end}>
                                {goalReached}
                            </Typography>
                        </Grid>
                    </Grid>
                </CardActions>
                <CardActions className={classes.center}>
                    {contractButton}
                </CardActions>
                <CardActions className={classes.center}>
                    <Typography>
                        <IconButton disabled={true}>
                            <CoinAvatarLabeled noName={true} coin={ {symbol: crowdsale.tokenToAccept.symbol, logoFile: crowdsale.tokenToAcceptLogo}} />
                            <Typography variant="caption">{crowdsale.acceptRatio + ' ' + crowdsale.tokenToAccept.symbol}</Typography>
                        </IconButton>
                        <Icon disabled>compare_arrows</Icon>
                        <IconButton disabled={true}>
                            <CoinAvatarLabeled noName={true} coin={ {symbol: crowdsale.tokenToGive.symbol, logoFile: crowdsale.tokenToGiveLogo}} />
                            <Typography variant="caption">{parseInt(crowdsale.giveRatio) + ' ' + crowdsale.tokenToGive.symbol}</Typography>
                        </IconButton>
                    </Typography>
                </CardActions>
                {yourReservationMessage}
                <Typography variant="caption" align="center" className={warningTypographyClass}>{warningText}</Typography>
                <CardActions className={classes.center}>
                    {pledgeButton}
                </CardActions>
                {/* <CardActions className={classes.actions} disableActionSpacing>
                        <IconButton aria-label="Add to favorites">
                        <FavoriteIcon color="error" />
                        </IconButton>
                        <Typography variant="caption">{t('favorites')}</Typography>
                        <IconButton disabled={true} aria-label="Share" className={classes.end}>
                        <ShareIcon color="primary" />
                        </IconButton>
                        <Typography variant="caption">{t('share')}</Typography>
                    </CardActions> */}
            </Card>

            <SlideModal
                open={isPiggyBankOpen}
                handleClose={ () => {
                    setPiggyBankOpen(false);
                    closePiggieDetails();
                }}
                title={t('partecipate')}
            >
                <PiggyBank
                    piggyBankClose={ () => {
                        setPiggyBankOpen(false);
                        closePiggieDetails();
                    }}
                    crowdsale={crowdsale}
                    crowdsaleEnded={crowdsaleTime.timeStatus === crowdsaleStatusEnum[0]}
                    tokenToAcceptUserBalance={tokenToAcceptUserBalance}
                    startingReservation={ crowdsale.totalReservations }
                    maxJoinLeft={maxJoinLeft}
                />
            </SlideModal>
        </>
    );
}


const mapStateToProps = state => {
    return {
        user: state.user.user,
        dao: state.dao.currentDao,
        crowdsales: state.crowdsale.crowdsales,
        profile: state.user.currentProfile,

        // coinList: state.coin.coinListForPiggies,

        userWalletAddress: state.web3.currentAccount,
        web3Instance: state.web3.web3Instance,
    };
};

const mapDispatchToProps = dispatch => {
    return{
    };
};

export default withStyles(piggiesDetailsStyle, {withTheme: true})(
        withWidth()(
            connect(mapStateToProps, mapDispatchToProps)(PiggiesDetails)
        )
);
