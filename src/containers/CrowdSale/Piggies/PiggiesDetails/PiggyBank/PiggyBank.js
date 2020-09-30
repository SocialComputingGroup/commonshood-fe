import React, {useState, useEffect} from "react";
import {logger} from '../../../../../utilities/winstonLogging/winstonInit';
import theme from '../../../../../theme/theme';

//i18n
import {useTranslation} from "react-i18next";

import Typography from "@material-ui/core/Typography";
import Icon from "@material-ui/core/Icon";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import {withStyles} from "@material-ui/core/styles";
import maialino from "../../../../../assets/img/pig-actionable.png";

import { connect } from 'react-redux';
import * as actions from "../../../../../store/actions";

import PiggyBankStyle from './PiggyBankStyle';

import PiggyBankModal from './PiggyBankConfirmationModal/PiggyBankConfirmationModal';

const PiggyBank = (props) => {
    const {
        classes,
        crowdsale,
        crowdsaleEnded,
        maxJoinLeft,
        piggyBankClose,
        startingReservation,
        tokenToAcceptUserBalance,

        //from redux:
        joined,
        joinCrowdsale,
        refunded,
        refundCrowdsale,
    } = props;
    const { crowdsaleAddress, acceptRatio, giveRatio, tokenToAccept, tokenToAcceptAddr, tokenToGive } = crowdsale;

    const [currentReservation, setCurrentReservation] = useState( parseFloat(startingReservation) );
    const [pledgeDifference, setpledgeDifference] = useState(0);
    const [openModal, setOpenModal] = useState(false);

    const {t} = useTranslation("PiggyBank");


    const handleSubmitPledge = async () => {
        if( pledgeDifference < 0 ) { //asking for a refund
            refundCrowdsale(
                crowdsaleAddress,
                pledgeDifference * -1,
                tokenToAccept.decimals
            );
        }else if(pledgeDifference > 0){
            joinCrowdsale(
                crowdsaleAddress,
                pledgeDifference,
                tokenToAccept.decimals,
                tokenToAcceptAddr
            );
        }
        setOpenModal(true);
    };

    const handleSuccessfulPledge = () => {
            piggyBankClose();
    };

    const changePledgeClicked = type => {
        if(type === "add"){
            setCurrentReservation( parseFloat((currentReservation + acceptRatio).toFixed(2)) );
            setpledgeDifference( parseFloat((currentReservation + acceptRatio - startingReservation).toFixed(2))  );
        }else{
            setCurrentReservation( parseFloat((currentReservation - acceptRatio).toFixed(2)) );
            setpledgeDifference( parseFloat((currentReservation - acceptRatio - startingReservation).toFixed(2)) );
        }
    };

    //current pledge message:
    let pledgeText = t('currentPledge');
    let pledgeValueClass = [classes.centeredPledgeValue, classes.unmodifiedPledgeValue].join(' ');

    if(pledgeDifference > 0){
        pledgeText = t('addingPledge', {
           params: {
               pledgeDifference,
               acceptedCoin: crowdsale.tokenToAccept.symbol
           }
        });
        pledgeValueClass = [classes.centeredPledgeValue, classes.positivePledgeValue].join(' ');
    }else if(pledgeDifference < 0){
        pledgeText = t('refundingPledge', {
            params: {
                pledgeDifference,
                acceptedCoin: crowdsale.tokenToAccept.symbol,
            }
        });
        pledgeValueClass = [classes.centeredPledgeValue, classes.negativePledgeValue].join(' ');
    }



    return (
        <div className={classes.center} style={{marginTop: '20px'}}>
            <Typography align="center" variant="subtitle2">
                {t('acceptingFor')}: <strong style={{display: 'inline'}}>{acceptRatio + ' ' + tokenToAccept.symbol}</strong>
            </Typography>
            <Typography align="center" variant="subtitle2">
                {t('returningFor')}: <strong style={{display: 'inline'}}>{giveRatio + ' ' + tokenToGive.symbol}</strong>
            </Typography>
            <Typography align="center" variant="body2">
                {t('acceptedCoinInWallet')}: <strong style={{display: 'inline'}}>{tokenToAcceptUserBalance + ' ' + tokenToAccept.symbol }</strong>
            </Typography>
            {/*<Typography align="left" variant="h6">*/}
            {/*    {t('minPledge')}: 10 {crowdsale.coinToGive}*/}
            {/*</Typography>*/}
            <div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                <IconButton
                    onClick={() => changePledgeClicked( "sub")}
                    disabled={
                        (currentReservation === 0) //can't refund below 0 investment
                    }
                >
                    <Icon fontSize="large">remove_circle</Icon>
                </IconButton>
                <div
                    style={{position: "relative", textAlign: "center"}}
                >
                    <img
                        width="260"
                        src={maialino}
                        alt="Piggy Bank"
                    />
                    <Typography
                        variant="h3"
                        display="inline"
                        className={pledgeValueClass}>
                        {currentReservation.toFixed(2)}
                    </Typography>
                </div>
                <IconButton
                    onClick={() => changePledgeClicked("add")}
                    disabled={
                        pledgeDifference + parseFloat(acceptRatio) > tokenToAcceptUserBalance || //cannot join anymore
                        crowdsaleEnded || //if crowdsale is over joining is not allowed anymore
                        ( parseFloat(maxJoinLeft) === parseFloat(pledgeDifference) )
                    }
                >
                    <Icon fontSize="large">add_circle</Icon>
                </IconButton>
            </div>
            <Typography paragraph={true} align="center" variant="subtitle1">
                {pledgeText}
            </Typography>
            <Button
                variant="contained"
                color="primary"
                fullWidth
                disabled={pledgeDifference === 0}
                onClick={handleSubmitPledge}
            >
                {t('pledge')}
            </Button>

            <PiggyBankModal
                closePiggyBank={handleSuccessfulPledge}
                openModal={openModal}
                tokenToAccept={tokenToAccept}
                refunded={refunded}
                joined={joined}
                pledgeDifference={pledgeDifference}
                closeModal={() => setOpenModal(false)}
            />
        </div>
    );
}

const mapStateToProps = state => {
    return{
        refunded: state.crowdsale.refunded,
        joined: state.crowdsale.joined,
    };
};

const mapDispatchToProps = dispatch => {
    return{
        joinCrowdsale: (crowdsaleAddress, amount, decimals, tokenToAcceptAddress) => dispatch(actions.crowdsaleJoin(crowdsaleAddress, amount, decimals, tokenToAcceptAddress)),
        refundCrowdsale: (crowdsaleAddress, amount, decimals) => dispatch(actions.crowdsaleRefund(crowdsaleAddress, amount, decimals)),
    };
};

export default withStyles(PiggyBankStyle, {withTheme: true})(
        connect(mapStateToProps, mapDispatchToProps)(PiggyBank)
);

