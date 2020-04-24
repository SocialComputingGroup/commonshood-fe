import React, {Component} from 'react';
import {logger} from '../../../../../utilities/winstonLogging/winstonInit';

//Inject styles
import { withStyles }from '@material-ui/core/styles'
import selectFormStyle from './SelectFormStyle';

import { Field } from 'formik'

import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';

//Redux actions connector
import { connect } from 'react-redux';

import {TextField} from "formik-material-ui";
import CoinList from '../../../../../components/Coin/CoinList/CoinList';
import Loading from '../../../../../components/UI/Loading/Loading';

import changeCase from 'change-case';

//i18n
import {withTranslation} from "react-i18next";
import {arrayComparison} from "../../../../../utilities/utilities";


class SelectForm extends Component {

    state = {
        coinSelectionList: undefined,
        selectedCoin: undefined,
        selectedCoinIndex: null
    };


    componentDidMount () {
        const { coinLoading, coinList } = this.props;

        const { coinSelectionList } = this.state;

        if (
            !coinLoading &&
            coinList &&
            !coinSelectionList
        ) {
            this.setState ({
                coinSelectionList: [...coinList].sort( (a,b) => a.symbol.localeCompare(b.symbol) ),
                selectedCoin: {...coinList[0]},
                selectedCoinIndex: 0
            })
        }
     }

    componentDidUpdate(prevProps, prevState, snapshot) {

        const { coinSelectionList } = this.state;
        const { coinList, setFieldValue } = this.props;

        if (coinList &&
            coinList.length !==0 &&
            coinSelectionList &&
            coinSelectionList.length!==0 &&
            !arrayComparison(coinSelectionList.sort( (a,b) => a.name.localeCompare(b.name)), coinList.sort( (a,b) => a.name.localeCompare(b.name)) )
        ){

            logger.debug("SelectForm - [UPDATING COIN LIST]");
            this.setState({coinSelectionList: coinList.slice()});
            if (prevState.selectedCoinIndex !== null) {
                this.setState({selectedCoin: {...coinList[prevState.selectedCoinIndex]}});
                setFieldValue('selectedCoin', coinList[prevState.selectedCoinIndex].symbol);
                setFieldValue('selectedBalance', coinList[prevState.selectedCoinIndex].balance);
                setFieldValue('decimals', coinList[prevState.selectedCoinIndex].decimals);
            }
        }


    }

    //Handlers
    updateSelectedCoin = (symbol) => {
        const {coinList, setFieldValue} = this.props;
        const { coinSelectionList } = this.state;

        if (coinList && coinList.length !== 0 ) {
            //Update local ID
            const selectedCoinIndex = this.state.coinSelectionList.findIndex((item) => item.symbol === symbol );
            logger.debug("SelectForm - [UPDATING SELECTED COIN]", coinSelectionList[selectedCoinIndex], 'with index ', selectedCoinIndex );
            this.setState({
                selectedCoin: {...coinSelectionList[selectedCoinIndex]},
                selectedCoinIndex: selectedCoinIndex
            });
            setFieldValue('selectedCoin', coinList[selectedCoinIndex].symbol);
            setFieldValue('selectedBalance', coinList[selectedCoinIndex].balance);
            setFieldValue('decimals', coinList[selectedCoinIndex].decimals);
        }
    };

    render() {

        const {
            coinSelectionList,
            selectedCoin,
            selectedCoinIndex
        } = this.state;

        const {
            t,
            handleChange,
            handleBlur,
            submitForm,
            classes,
            values
        } = this.props;



        let form = (<Loading  withLoader title={t('Common:loadingForm') + "..."} />);

        if (coinSelectionList && coinSelectionList.length !==0) {

            form = (
                <>
                    <CoinList
                        withRadio
                        id={this.coinInputName}
                        coinList={coinSelectionList}
                        selectedCoin={selectedCoinIndex}
                        //onChange={handleChange}
                        handleSelect={(symbol) => this.updateSelectedCoin(symbol)}
                        //handleBalance={(symbol,balance) => this.updateCoinBalanc
                        // e(symbol,balance)}
                    />

                    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        {selectedCoin.logoFile ?
                            <Avatar style={{
                                width: '100px',
                                height: '100px',
                                margin: '8px'
                            }} src={selectedCoin.logoFile}/>
                            :
                            <Avatar style={{
                                width: '100px',
                                height: '100px',
                                margin: '8px'
                            }}>{coinSelectionList[selectedCoin].symbol}</Avatar>
                        }

                        <Field
                            name="amount"
                            placeholder={changeCase.upperCaseFirst(t('Common:amount'))}
                            type="string"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            component={TextField}
                            value={values.amount || ''}
                        />
                        <Field type="hidden" name="selectedBalance" value={selectedCoin.balance || ''} />
                        <Typography
                            className={classes.symbolClass}
                            variant="h6">{selectedCoin.symbol}</Typography>
                    </div>
                    <div style={{padding: '8px', marginLeft:'auto', marginRight: 'auto'}}>
                        <Button fullWidth
                                type="submit"
                                className={classes.buttons} variant="contained"
                                onClick={submitForm}
                                disabled={this.props.coinLoading}>
                            {changeCase.upperCaseFirst(t('Common:send'))}
                        </Button>
                    </div>
                    {/*<div>{JSON.stringify(this.props.values)}</div>*/}
                </>
                )

        }

        return form;
    }

}

const mapStateToProps = state => {
    return {
        loading: state.file.loading,
        coinList: state.coin.coinList,
        coinLoading: state.coin.loading,
        profile: state.user.currentProfile
    }
};

const mapDispatchToProps = dispatch => {
    return {
        //onCoinGetList: (type,withBalance, coins) => dispatch (actions.coinGetList(type,withBalance, coins)),
        //onCoinGetListReset: () => dispatch(actions.coinGetListReset()),
    }
};

export default withTranslation(['CoinSendForm_Step1', 'Common']) (
    connect(mapStateToProps,mapDispatchToProps) (
        withStyles(selectFormStyle) (SelectForm)
    )
);
