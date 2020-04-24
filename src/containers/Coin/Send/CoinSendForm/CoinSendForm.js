import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';

//i18n
import {withTranslation} from "react-i18next";

//Redux actions connector
import { connect } from 'react-redux';
import * as actions from "../../../../store/actions";

//Style injection
import withStyles from '@material-ui/core/styles/withStyles';
import CoinSendFormStyle from './CoinSendFormStyle';

//Validation schema
import { Formik } from 'formik';
import getValidationSchema from "./getValidationSchema";
import asyncComponent from "../../../../hoc/AsyncComponent/AsyncComponent";
//import Step1 from "./Steps/Step1";

//Async material components
const Grid = asyncComponent(()=>import('@material-ui/core/Grid'));
const Typography = asyncComponent(()=>import('@material-ui/core/Typography'));
const Button = asyncComponent(()=>import('@material-ui/core/Button'));

//Async Custom components
const AlertAvatar = asyncComponent(()=>import('../../../../components/UI/AlertAvatar/AlertAvatar'));
const Loading = asyncComponent(()=>import('../../../../components/UI/Loading/Loading'));
const SplashScreen = asyncComponent(()=>import('../../../../components/UI/SplashScreen/SplashScreen'));
const SelectForm = asyncComponent(()=>import('./SelectForm/SelectForm'));


class CoinSendForm extends Component {


    state = {
        waitForCoinSend: false,
    };

    componentDidMount() {
        const {
            onCoinGetList,
            coinLoading,
            profile,
            preselectedCoin
        } = this.props;

        //Load coin list from current profile
        if (!coinLoading &&
            //!this.state.localCoinList &&
            profile) {
                if(!preselectedCoin)
                    onCoinGetList(null, false, true, false);
                else{                    
                    onCoinGetList(null, false, true, false, [preselectedCoin.address])
                }
        }
    }

    componentDidUpdate() {
        const {coinLoading, coinSent, coinError} = this.props;
        const { waitForCoinSend } = this.state;

        if (waitForCoinSend && !coinLoading && (coinError || coinSent )) {
            this.setState({waitForCoinSend: false})
        }
    }

    handleCoinSend = (values) => {
        this.setState({waitForCoinSend: true});
        const coinData = {
            symbol: values.selectedCoin,
            amount: values.amount,
            decimals: values.decimals,
            destUser: this.props.contact
        };

        this.props.onCoinSend(coinData);
        this.props.onCoinUnsetPreselected();
    };

    //Redirect to coin creation in case there's no coin in wallet
    handleCreateButton = () => {
        this.props.history.push('/coinCreate?firstTime');
    };

    render () {
        const {
            t, //i18n from HOC
            contact,
            coinSent,
            coinSentMining,
            coinError,
            classes,
            coinList,
            handleClose
        } = this.props;

        const { waitForCoinSend } = this.state;

        //Waiting for contact to be loaded
        let form = (<Loading withLoader title={t('Common:loadingForm')}/>);

        if (waitForCoinSend) {
            form = (<Loading withLoader title ={t('waitForCoinSend')}/>)
        }

        if (contact) {
            if (coinList && coinList.length !== 0) { // There are coins in wallet
                if (!coinSent && !coinError && !coinSentMining) {
                    form = (
                        <Formik
                            initialValues={{
                                selectedCoin: undefined,
                                amount: 0,
                                selectedBalance: 0,
                                decimals: -3
                            }}
                            onSubmit={
                                (values, actions) => {
                                    this.handleCoinSend(values);
                                    actions.setSubmitting(false);
                                }}
                            validationSchema={getValidationSchema(t)}
                            render={props => <SelectForm {...props} />}
                        />)
                } else if (!coinSent && !coinError && coinSentMining) {
                    form = (
                        <SplashScreen title={t('splashScreenMiningTitle')} avatarProps={{'big': true}}>
                            <div>{t('splashScreenMiningInfo')}</div>
                            <div>{t('splashScreenMiningInfo2')}</div>
                            <div>
                                <Button className={classes.buttons} variant='contained' onClick={handleClose}>{t('splashScreenMiningButton')}</Button>
                            </div>
                        </SplashScreen>
                    )
                } else {
                    form = (
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <AlertAvatar
                                style={{marginLeft: 'auto', marginRight: 'auto'}}
                                big
                                success={coinSent}
                                fail={coinError}/>
                            <Typography variant="subtitle1">{coinSent
                                ? t('paymentSent')
                                : coinError ? t('paymentError') + coinError
                                    : null}</Typography>
                        </div>
                    )
                }
            }else if(coinList && coinList.length === 0 ) { //There is no coin in wallet to send
                form = (
                <SplashScreen title={t('noCoinTitle')} avatarProps={{'big': true, 'warning': true}}>
                    <div>{t('doYouWantToCreateCoin')}</div>
                    <div>
                        <Button className={classes.buttons} variant='contained' onClick={this.handleCreateButton}>{t('createNewCoin')}</Button>
                    </div>
                </SplashScreen>)
            }    
        } 

        // Render form page
        return (
            <Grid container  >
                <Grid item xs={12} className={classes.root}> {form}</Grid>
            </Grid>
        );
    }
}

const mapStateToProps = state => {
    return {
        coinLoading: state.coin.loading,
        coinSent: state.coin.coinSent,
        coinSentMining: state.coin.coinSentMining,
        coinError: state.coin.error,
        coinList: state.coin.coinList,
        profile: state.user.currentProfile
    }
};


const mapDispatchToProps = dispatch => {
    return {
        onCoinGetList: (type, withBalance, onlyOwned, forPiggies, addressArrayFilter) => dispatch (actions.coinGetList(type, withBalance, onlyOwned, forPiggies, addressArrayFilter)),
        onCoinSend : (coinData) => dispatch (actions.coinSend(coinData)),
        onCoinSentReset: ()=> dispatch (actions.coinSendReset()),
        onCoinUnsetPreselected: () => dispatch(actions.coinUnsetPreselected()),
    }
};

export default withTranslation(['CoinSendForm', 'Common']) (
    connect(mapStateToProps,mapDispatchToProps)(
        withStyles(CoinSendFormStyle) (withRouter(CoinSendForm))
    )
);