import React from "react";
import PropTypes from "prop-types";
import { connect } from 'react-redux';
import * as actions from "../../../../store/actions/index";
import {logger} from '../../../../utilities/winstonLogging/winstonInit';

import withWidth, { isWidthUp, isWidthDown } from '@material-ui/core/withWidth';

import { base64ToArrayBuffer } from '../../../../utilities/utilities'

import Grid from '@material-ui/core/Grid';
//styles
import { withStyles } from "@material-ui/core/styles";
import piggiesDetailsStyle from './PiggiesDetailsStyle';

//i18n
import {withTranslation} from "react-i18next";

import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Icon from "@material-ui/core/Icon";
import Button from "@material-ui/core/Button";
import Slide from '@material-ui/core/Slide';
import asyncComponent from '../../../../hoc/AsyncComponent/AsyncComponent';

import CoinAvatarLabeled from '../../../../components/UI/CoinAvatarLabeled/CoinAvatarLabeled';

const SlideModal = asyncComponent(()=>import('../../../../components/UI/Modal/SlideModal/SlideModal'));
const PiggyBank = asyncComponent( () =>import('./PiggyBank/PiggyBank'));


class PiggiesDetails extends React.Component {
    state = { 
        expanded: false,
        piggyBankOpened: false,
        isCrowdsaleOwnedByAUser: false,
        isCrowdsaleOwnedByADao: false,
    };

    componentDidMount() {
        const {
            onGetUserFromId,
            onGetDaoFromId,
            onGetCrowdsaleCompleteReservations,
            onGetAcceptedCoinBalance,
            onGetProfileReservationInCrowdsale,
            onGetCrowdsaleStatus,
            onGetFile,
            crowdsale,
        } = this.props;

        if(crowdsale.owner.type === 'user'){
            onGetUserFromId(crowdsale.owner.id);
            this.setState({isCrowdsaleOwnedByAUser: true});
        }else{
            onGetDaoFromId(crowdsale.owner.id);
            this.setState({isCrowdsaleOwnedByADao: true});
        }

        onGetFile(crowdsale.contract);
        if(!crowdsale.owned){
            onGetCrowdsaleCompleteReservations(crowdsale.crowdsaleID, crowdsale.acceptedCoinDecimals);
            onGetAcceptedCoinBalance(crowdsale.acceptedCoin, crowdsale.acceptedCoinDecimals);
            onGetCrowdsaleStatus(crowdsale.crowdsaleID);
            onGetProfileReservationInCrowdsale(crowdsale.crowdsaleID, crowdsale.acceptedCoinDecimals);
        }

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {
            onGetAcceptedCoinBalance,
            onGetProfileReservationInCrowdsale,
            onGetCrowdsaleCompleteReservations,
            onGetCrowdsaleStatus,
            crowdsale,
        } = this.props;

        logger.info("PIGGIES DETAILS just updated");
        if(
            (JSON.stringify(prevProps.crowdsales) !== JSON.stringify(this.props.crowdsales)) &&
            !crowdsale.owned
        ){
            onGetCrowdsaleCompleteReservations(crowdsale.crowdsaleID, crowdsale.acceptedCoinDecimals);
            onGetAcceptedCoinBalance(crowdsale.acceptedCoin, crowdsale.acceptedCoinDecimals);
            onGetCrowdsaleStatus(crowdsale.crowdsaleID);
            onGetProfileReservationInCrowdsale(crowdsale.crowdsaleID, crowdsale.acceptedCoinDecimals);
        }
    }

    piggyBankOpen = () => {
        this.setState({
            piggyBankOpened: true
        });
    };

    piggyBankClose = () => {
        this.setState({
            piggyBankOpened: false
        });
        this.props.closePiggieDetails();
    };

    transition = props =>  (<Slide direction="up" {...props} />);

    downloadContract = () => {
        if(!this.props.fileLoading && this.props.fileData){
            let arrBuffer = base64ToArrayBuffer(this.props.fileData.body);

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
                link.download = this.props.fileData.name;
                link.click();
                window.URL.revokeObjectURL(data);
                link.remove();
            }
        }
    };


    render() {
        const {
            classes,
            t,
            crowdsale,
            completeReservations,
            user,
            dao,
            profile,
            coinToJoinLoaded,
            coinToJoinBalance,
            reservationLoaded,
            reservationValue,
            crowdsaleStatus,
            coinList,
            fileLoading,
            fileData,
        } = this.props;
        logger.debug('COMPLETERES =>', completeReservations);
        //const totalReservations = crowdsale ? crowdsale.totalReservations : null;

        logger.debug('[crowdsale for this piggiedetail =>', crowdsale);

        if(
            crowdsale !== null && (
                ( this.state.isCrowdsaleOwnedByAUser && user !== null) ||
                ( this.state.isCrowdsaleOwnedByADao && dao !== null)
            )
        ){

            const startDate = new Date(crowdsale.startDate);
            const endDate = new Date(crowdsale.endDate);
            const today = new Date();

            //COMPUTE TIME
            let timeleftElement = null;
            let timeLeft = 0,  startingDateReached = true, crowdsaleEnded = false;
            if(completeReservations !== crowdsale.maxCap) { //it makes sense to show time left only if crowdsale has not already reached maxCap
                if (startDate <= today) { // crowdsale has already started
                    timeLeft = (endDate - today) / (1000 * 60 * 60 * 24);
                    logger.debug('PiggiesDetails -> TIMELEFT', timeLeft);
                    if (timeLeft <= 0) { // crowdsale has ended
                        timeleftElement = (
                            <CardActions className={classes.actions}>
                                <Grid container alignContent="space-between" direction="row">
                                    <Grid item align={isWidthUp('sm', this.props.width) ? "right" : "center"} xs={12}>
                                        <Icon className={classes.end}>alarm_on</Icon>
                                        <Typography variant="caption">{t('crowdsaleEnded')}</Typography>
                                    </Grid>
                                </Grid>
                            </CardActions>
                        );
                        crowdsaleEnded = true;
                    } else if (timeLeft < 1) {
                        timeleftElement = (
                            <CardActions className={classes.actions}>
                                <Grid container alignContent="space-between" direction="row">
                                    <Grid item align={isWidthUp('sm', this.props.width) ? "right" : "center"} xs={12}>
                                        <Icon className={classes.end}>alarm_on</Icon>
                                        <Typography variant="caption">{t('timeLeftLessThanADay')}</Typography>
                                    </Grid>
                                </Grid>
                            </CardActions>
                        );
                    } else { //crowdsale not ended yet
                        timeLeft = Math.round(timeLeft);
                        timeleftElement = (
                            <CardActions className={classes.actions}>
                                <Grid container alignContent="space-between" direction="row">
                                    <Grid item align={isWidthUp('sm', this.props.width) ? "right" : "center"} xs={12}>
                                        <Icon className={classes.end}>alarm_on</Icon>
                                        <Typography variant="caption">{t('timeLeft', {params: {days: timeLeft}})}</Typography>
                                    </Grid>
                                </Grid>
                            </CardActions>
                        );
                    }
                } else {
                    timeleftElement = (
                        <CardActions className={classes.actions}>
                            <Icon className={classes.end}>alarm_on</Icon>
                            <Typography variant="caption">{t('startingDateNotReachedYet')}</Typography>
                        </CardActions>
                    );
                    startingDateReached = false;
                }
            }


            //images
            let acceptedCoinLogo = null, coinToGiveLogo = null;;
            if(coinList != null && coinList.length !== 0){
                const accCoin = coinList.find( (elem) => elem.symbol === crowdsale.acceptedCoin );
                acceptedCoinLogo = accCoin == null ? null : accCoin.logoFile;
                const coinGiv =  coinList.find( (elem) => elem.symbol === crowdsale.coinToGive );
                coinToGiveLogo = coinGiv == null ? null : coinGiv.logoFile;
            }

            const owned = crowdsale.owned;

            //check if we have a pending transaction (not yet received notification)
            let crowdsaleHasPendingTransaction = false;
            if(
                profile.hasOwnProperty('crowdsalesWithPendingTransaction') &&
                profile.crowdsalesWithPendingTransaction.has(crowdsale.crowdsaleID)
            ){
                logger.debug('PiggiesDetails -> CHECKING crowdsaleId=', crowdsale.crowdsaleID);
                crowdsaleHasPendingTransaction = true;
            }
            logger.info('PiggiesDetails -> CROWDSALE has pending transaction?', crowdsaleHasPendingTransaction);

            let warningText = "";
            let warningTypographyClass = classes.doNotShowWarningText;
            //logic to change text (order is important), the lower the highest priority
            if(!owned && coinToJoinLoaded && (parseFloat(coinToJoinBalance) < parseFloat(crowdsale.acceptRatio)) && reservationLoaded && (parseFloat(reservationValue) <= 0)){// I have to check if I have some reservation even without coin in the wallet (I can ask a refund)
                warningText = t('notEnoughCoinToJoin', {params: {ticker: crowdsale.acceptedCoin}});
                warningTypographyClass = classes.showWarningText;
            }
            if(!owned && reservationLoaded && (parseFloat(reservationValue) < 0)){ //if value is < 0 we got a problem loading it
                warningText = t('reservationLoadingFailure');
                warningTypographyClass = classes.showWarningText;
            }
            if(!owned && (crowdsaleStatus === 'stopped' || crowdsaleStatus === 'locked')){
                warningText = t('crowdsaleNotRunning');
                warningTypographyClass = classes.showWarningText;
            }
            if(!owned && crowdsaleEnded){
                warningText = t('crowdsaleEnded');
                warningTypographyClass = classes.showWarningText;
            }
            if(!owned && (crowdsaleEnded || crowdsaleStatus !== 'running' ) && reservationLoaded && (parseFloat(reservationValue) > 0)){
                warningText = t('crowdsaleEndedWithReservationLeft');
                warningTypographyClass = classes.showWarningText;
            }
            if(!owned && !startingDateReached){
                warningText = t('startingDateNotReachedYet');
                warningTypographyClass = classes.showWarningText;
            }
            if(crowdsaleHasPendingTransaction){
                warningText = t('hasPendingTransaction');
                warningTypographyClass = classes.showWarningText;
            }
            if(owned){
                warningText = t('crowdsaleOwned');
                warningTypographyClass = classes.showWarningText;
            }
            if(profile.realm === 'dao'){ //daos cannot join any crowdsale
                warningText = t('daosCannotParticipate');
                warningTypographyClass = classes.showWarningText;
            }
            if(crowdsaleStatus === 'failed'){
                warningText = t('crowdsaleFailedToRetriveState');
                warningTypographyClass = classes.showWarningText;
            }


            const pledgeButton = (
                <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    fullWidth
                    disabled = {
                        owned || //cannot join crowdsale of which I am the owner
                        profile.realm === 'dao' || //daos cannot join any crowdsale
                        (!owned && !startingDateReached) ||
                        (!owned && crowdsaleEnded && reservationLoaded && (parseFloat(reservationValue) <= 0)) ||
                        //crowdsaleEnded || //cannot join a crowdsale already expired
                        !coinToJoinLoaded || //we are still waiting to get the balance of the coin to join for this user_profile
                        ( coinToJoinLoaded && (parseFloat(coinToJoinBalance) < parseFloat(crowdsale.acceptRatio) ) && reservationLoaded && (parseFloat(reservationValue) <= 0) ) || //the user_profile has not enough acceptedcoin to join nor reservation to refund
                        (reservationLoaded && (parseFloat(reservationValue) < 0)) ||//we got a problem loading the reservation if its value is < 0
                        ((crowdsaleStatus !== 'running') && reservationLoaded && (parseFloat(reservationValue) <= 0)) || //allow refunds even after it stopped (business rule)
                        crowdsaleHasPendingTransaction //wait confirmation before allowing other pledges
                    }
                    onClick = {() => {this.piggyBankOpen()}}
                >
                    {t('pledge')}
                </Button>
            );

            let localeStartingDate = `${startDate.toLocaleString()}` ;
            let localeEndingDate =  `${endDate.toLocaleString()}`;

            let goalReached = null;
            if(
                completeReservations !== undefined &&
                completeReservations !== -1 &&
                parseFloat(completeReservations) <= parseFloat(crowdsale.maxCap)
            ){
                goalReached = (
                    <>
                        <Icon className={classes.end}>trending_up</Icon>
                        {t('goalReached', {params:
                            {
                                currentReservation: completeReservations, //getRandomNumberInRange(10,90)+'%'
                                threshold: crowdsale.maxCap,
                                ticker: crowdsale.acceptedCoin,
                            }
                        })}
                    </>
                );
            }

            // if we are over maxCap the remaining coin are not convertible in coupons anymore (coupons are over)
            // we use this value to allow the user to refund even at crowdsale over
            let maxJoinLeft = parseFloat(completeReservations) >= parseFloat(crowdsale.maxCap) ? 0 : parseFloat(crowdsale.maxCap) - parseFloat(completeReservations);

            //contract file
            let contractButton = null;
            if( !fileLoading && fileData){
                contractButton = (
                    <Button
                        variant="contained"
                        color="primary"
                        className={classes.button}
                        onClick = {() => {this.downloadContract()}}
                    >
                        {t('downloadContract')}
                    </Button>
                );
            }

            let yourReservationMessage = null;
            if(!owned && reservationLoaded ){
                if(parseFloat(reservationValue) > 0) {
                    const params = {params: { reservation: parseFloat(reservationValue), ticker: crowdsale.acceptedCoin}};
                    yourReservationMessage =
                        <Typography variant="overline" align="center" style={{display: 'block'}} >{t('youAlreadyJoined', params )}</Typography>
                }else{
                    yourReservationMessage = <Typography variant="overline" align="center" style={{display: 'block'}}>{t('youHaveNotJoinedYet')}</Typography>
                }
            }

            let ownerName = '';
            if(this.state.isCrowdsaleOwnedByAUser && user){
                ownerName = user.name;
            }else if(this.state.isCrowdsaleOwnedByADao && dao){
                ownerName = dao.name;
            }

            return (
            <>
                <Card square className={classes.card}>
                    <CardMedia
                        component="img"
                        className={classes.media}
                        image={crowdsale.photo.file.body}
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
                            <Grid item align={isWidthUp('sm', this.props.width) ? "left" : "center"} xs={12} sm={6}>
                                <Icon>calendar_today</Icon>
                                <Typography variant="caption">{`${t('starting')}: ${localeStartingDate}`}</Typography>
                            </Grid>
                            <Grid item align={isWidthUp('sm', this.props.width) ? "right" : "center"} xs={12} sm={6}>
                                <Icon className={classes.end}>calendar_today</Icon>
                                <Typography variant="caption">{`${t('ending')}: ${localeEndingDate}`}</Typography>
                            </Grid>
                        </Grid>
                    </CardActions>
                    {timeleftElement}
                    <CardActions className={classes.actions}>
                        <Grid container alignContent="space-between" direction="row">
                            <Grid item align={isWidthUp('sm', this.props.width) ? "left" : "center"} xs={12} sm={6}>
                                <Typography>{t('owner')}: {ownerName} </Typography>
                            </Grid>
                            <Grid item align={isWidthUp('sm', this.props.width) ? "right" : "center"} xs={12} sm={6}>
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
                                <CoinAvatarLabeled noName={true} coin={ {symbol: crowdsale.acceptedCoin, logoFile: acceptedCoinLogo}} />
                                <Typography variant="caption">{crowdsale.acceptRatio + ' ' + crowdsale.acceptedCoin}</Typography>
                            </IconButton>
                            <Icon disabled>compare_arrows</Icon>
                            <IconButton disabled={true}>
                                <CoinAvatarLabeled noName={true} coin={ {symbol: crowdsale.coinToGive, logoFile: coinToGiveLogo}} />
                                <Typography variant="caption">{parseInt(crowdsale.giveRatio) + ' ' + crowdsale.coinToGive}</Typography>
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
                    open={this.state.piggyBankOpened}
                    handleClose={this.piggyBankClose}
                    title={t('partecipate')}
                    transition={this.transition}
                >
                    <PiggyBank
                        piggyBankClose={this.piggyBankClose}
                        crowdsale={crowdsale}
                        crowdsaleEnded={crowdsaleEnded}
                        coinToJoinBalance={coinToJoinBalance}
                        startingReservation={parseFloat(reservationValue).toFixed(2)}
                        maxJoinLeft={maxJoinLeft}
                    />
                </SlideModal>
            </>
            );

        }else{
            return null;
        }
    }
}

PiggiesDetails.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => {
    return {
        user: state.user.user,
        dao: state.dao.currentDao,
        crowdsales: state.crowdsale.crowdsales,
        profile: state.user.currentProfile,
        coinToJoinBalance: state.crowdsale.participantCoinToJoinBalance,
        coinToJoinLoaded: state.crowdsale.participantCoinToJoinLoaded,
        reservationValue: state.crowdsale.participantReservationValue,
        reservationLoaded: state.crowdsale.participantReservationLoaded,
        crowdsaleStatus: state.crowdsale.crowdsaleStatus,
        completeReservations: state.crowdsale.totalReservation,
        coinList: state.coin.coinListForPiggies,
        fileLoading: state.file.loading,
        fileData: state.file.fileData,
    };
};

const mapDispatchToProps = dispatch => {
    return{
        onGetUserFromId: (id) => dispatch(actions.userGetDataFromId(id)),
        onGetDaoFromId: (id) => dispatch(actions.daoGetDataFromId(id)),

        onGetAcceptedCoinBalance: (acceptedCoinTicker, acceptedCoinDecimals) => dispatch(actions.crowdsaleGetParticipantCoinBalance(acceptedCoinTicker, acceptedCoinDecimals)),
        onGetProfileReservationInCrowdsale : (crowdsaleId, acceptedCoinDecimals) => dispatch(actions.crowdsaleGetParticipantReservation(crowdsaleId, acceptedCoinDecimals)),
        onGetCrowdsaleStatus: (crowdsaleId) => dispatch(actions.crowdsaleGetStatus(crowdsaleId)),
        onGetCrowdsaleCompleteReservations: (crowdsaleId, acceptedCoinDecimals) => dispatch(actions.crowdsaleGetCompleteReservations(crowdsaleId, acceptedCoinDecimals)),
        onGetFile: (fileHash) => dispatch(actions.fileGetData(fileHash)),
    };
};

export default withStyles(piggiesDetailsStyle, {withTheme: true})(
        withTranslation('PiggiesDetails') (
            withWidth()(
                connect(mapStateToProps, mapDispatchToProps)(PiggiesDetails)
            )
        )
    );
