import React, {Component} from 'react';


//Custom Style
import {coinListItemStyle} from "./coinListItemStyle"
import withStyles from "@material-ui/core/styles/withStyles"

//Redux Connection for files
import { connect } from 'react-redux';
import * as actions from "../../../../store/actions";

import CoinListDetails from './CoinListDetails'

class CoinListItem extends Component {

    state = {
        coinBalance: undefined,
    };

    shouldComponentUpdate(nextProps, nextState) {
        if(
            ( 
                (nextProps.coin.balance == null) || 
                (nextProps.coin.balance === this.state.coinBalance ) //I already have loaded a value for this coin via redux
            )
            && 
            (nextProps.selected === this.props.selected) //change in radio selection should trigger update
            ){
            return false;
        }
        return true;
    }

    componentDidMount() {
        const { coin, onGetBalance, coinLoading } = this.props;
        const { coinBalance } = this.state;
        if (!coinBalance && !coinLoading) {
            onGetBalance(coin.symbol, coin.address);
        }
    }

    componentDidUpdate (prevProps, prevState) {
        const { coin } = this.props;
        const { coinBalance } = this.state;

        if (coin.balance != null && coinBalance == null) {
            this.setState ({coinBalance: coin.balance});
        }
    }



    render() {
        const {
            id,
            coin,
            selected,
            handleSelect,
            withRadio,
            showPayButton
        } = this.props;

        const { coinBalance } = this.state;

        return (
            <CoinListDetails
                id={id}
                coin = {coin}
                balance = {coinBalance}
                iconData={coin.logoFile}
                selected={selected}
                handleSelect={() => handleSelect(coin.symbol)}
                showPayButton={showPayButton}
                withRadio={withRadio}
            />
        );

    };
}

const mapStateToProps = state => {
    return {
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onGetBalance: (symbol, coinAddress) => dispatch(actions.coinGetBalance(symbol, coinAddress)),
    }
};

export default connect(mapStateToProps,mapDispatchToProps)(withStyles(coinListItemStyle)(CoinListItem));


