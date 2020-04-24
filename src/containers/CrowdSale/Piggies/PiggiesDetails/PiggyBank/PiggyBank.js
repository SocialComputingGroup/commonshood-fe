import React from "react";
import {logger} from '../../../../../utilities/winstonLogging/winstonInit';
import theme from '../../../../../theme/theme';

//i18n
import {withTranslation} from "react-i18next";

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

class PiggyBank extends React.Component {
    state = {
        currentReservation: parseFloat(this.props.startingReservation),
        pledgeDifference: 0,
        openModal: false,
    };

    handleSubmitPledge = () => {
        const {
            pledgeDifference
        } = this.state;
        const {
            crowdsale,
            joinCrowdsale,
            refundCrowdsale,
        } = this.props;

        if(pledgeDifference < 0){ //we are asking for a refund
            refundCrowdsale(crowdsale.crowdsaleID, pledgeDifference * -1, crowdsale.acceptedCoinDecimals);
        }else if(pledgeDifference > 0){ //we are asking to join with more
            joinCrowdsale(crowdsale.crowdsaleID, pledgeDifference, crowdsale.acceptedCoinDecimals);
        }// pledge with a === 0 difference is not useful

        this.setState({
            openModal: true
        });
    };

    handleSuccessfulPledge = () => {
        this.props.piggyBankClose();
    };

    changePledgeClicked = type => {
        const {
            crowdsale
        } = this.props;


        this.setState(prevState => {
            const acceptRatio = parseFloat(crowdsale.acceptRatio);
            const currentReservation = parseFloat(prevState.currentReservation);
            const startingReservation = parseFloat(this.props.startingReservation);
            logger.info('PiggyBank -> PLEDGE => acceptRatio, currentRes, startingRes', acceptRatio, currentReservation, startingReservation);
            if(type === "add") {
                return {
                    // DO NOT ASK why - -, yes i want a sum, for some strange reasons it keeps returning a string even after parseFloat if using +... THIS WORKS ANYWAY
                    currentReservation: parseFloat((currentReservation + acceptRatio).toFixed(2)),
                    pledgeDifference: parseFloat((currentReservation + acceptRatio - startingReservation).toFixed(2))
                };
            }else{
                return{
                    currentReservation: parseFloat((currentReservation - acceptRatio).toFixed(2)),
                    pledgeDifference: parseFloat((currentReservation - acceptRatio - startingReservation).toFixed(2))
                }
            }
        });
    };

    render() {
        const {
            classes,
            t,
            crowdsale,
            coinToJoinBalance
        } = this.props;

        //message current pledge
        let pledgeText = t('currentPledge');
        let pledgeValueClass = [classes.centeredPledgeValue, classes.unmodifiedPledgeValue].join(' ');
        if(this.state.pledgeDifference > 0){
            pledgeText = t('addingPledge', {
                params: {
                    pledgeDifference: this.state.pledgeDifference,
                    acceptedCoin: crowdsale.acceptedCoin,
                }
            });
            pledgeValueClass = [classes.centeredPledgeValue, classes.positivePledgeValue].join(' ');
        }else if(this.state.pledgeDifference < 0){
            pledgeText = t('refundingPledge', {
                params: {
                    pledgeDifference: this.state.pledgeDifference,
                    acceptedCoin: crowdsale.acceptedCoin,
                }
            });
            pledgeValueClass = [classes.centeredPledgeValue, classes.negativePledgeValue].join(' ');
        }

        return (
            <div className={classes.center} style={{marginTop: '20px'}}>
                <Typography align="center" variant="subtitle2">
                    {t('acceptingFor')}: <strong style={{display: 'inline'}}>{crowdsale.acceptRatio + ' ' + crowdsale.acceptedCoin}</strong>
                </Typography>
                <Typography align="center" variant="subtitle2">
                    {t('returningFor')}: <strong style={{display: 'inline'}}>{parseInt(crowdsale.giveRatio) + ' ' + crowdsale.coinToGive}</strong>
                </Typography>
                <Typography align="center" variant="body2">
                    {t('acceptedCoinInWallet')}: <strong style={{display: 'inline'}}>{coinToJoinBalance + ' ' + crowdsale.acceptedCoin}</strong>
                </Typography>
                {/*<Typography align="left" variant="h6">*/}
                {/*    {t('minPledge')}: 10 {crowdsale.coinToGive}*/}
                {/*</Typography>*/}
                <div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                    <IconButton
                        onClick={() => this.changePledgeClicked( "sub")}
                        disabled={
                            (this.state.currentReservation === 0) //can't refund below 0 investment
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
                            {this.state.currentReservation.toFixed(2)}
                        </Typography>
                    </div>
                    <IconButton
                        onClick={() => this.changePledgeClicked("add")}
                        disabled={
                            this.state.pledgeDifference + parseFloat(crowdsale.acceptRatio) > coinToJoinBalance || //cannot join anymore
                            this.props.crowdsaleEnded || //if crowdsale is over joining is not allowed anymore
                            ( parseFloat(this.props.maxJoinLeft) === parseFloat(this.state.pledgeDifference) )
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
                    disabled={this.state.pledgeDifference === 0}
                    onClick={this.handleSubmitPledge}
                >
                    {t('pledge')}
                </Button>

                <PiggyBankModal
                    closePiggyBank={this.handleSuccessfulPledge}
                    openModal={this.state.openModal}
                    acceptedCoin={crowdsale.acceptedCoin}
                    refunded={this.props.refunded}
                    joined={this.props.joined}
                    pledgeDifference={this.state.pledgeDifference}
                    closeModal={() => this.setState({openModal: false})}
                />
            </div>
        );
    }
}

const mapStateToProps = state => {
    return{
        refunded: state.crowdsale.refunded,
        joined: state.crowdsale.joined,
    };
};

const mapDispatchToProps = dispatch => {
    return{
        joinCrowdsale: (crowdsaleId, amount, acceptedCoinDecimals) => dispatch(actions.crowdsaleJoin(crowdsaleId, amount, acceptedCoinDecimals)),
        refundCrowdsale: (crowdsaleId, amount, acceptedCoinDecimals) => dispatch(actions.crowdsaleRefund(crowdsaleId, amount, acceptedCoinDecimals)),
    };
};

export default withStyles(PiggyBankStyle, {withTheme: true})(
    withTranslation('PiggyBank')(
        connect(mapStateToProps, mapDispatchToProps)(PiggyBank)
    )
);

