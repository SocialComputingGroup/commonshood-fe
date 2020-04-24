//import React from "react";
import React, {Component} from 'react';

//Redux actions connector
import { connect } from 'react-redux';
import * as actions from "../../../../store/actions";

//Lazy loading for Code Splitting
import CoinSelectDetails from './CoinSelectDetails';

class CoinSelectItem extends Component {

    state = {
        coinBalance: undefined,
    };

    componentDidMount() {
        const { coin, onGetBalance, coinLoading } = this.props;
        const { coinBalance } = this.state;
        if (!coinBalance && !coinLoading) {
            onGetBalance(coin.symbol, coin.address);
        }
    }

    componentDidUpdate (prevProps,prevState,snapshot) {
        const { coinList, coin } = this.props;
        const { coinBalance } = this.state;

        const localCoin = coinList.find(item=>item.symbol === coin.symbol);
        if (coin && coinList && coinBalance == null) {
            this.setState ({coinBalance: localCoin.balance})
        } else if (coinBalance && prevProps.coin.symbol !== localCoin.symbol ) {
            this.setState({coinBalance: localCoin.balance})
        }
    }

    render() {
        const {
            coin,
            showCoinBalance,
            value,
            key,
            selected,
            onClick,
        } = this.props;

        const { coinBalance } = this.state;

        if (coin) {
            return (

                    <CoinSelectDetails
                        coin={coin}
                        value={value}
                        balance={coinBalance}
                        showCoinBalance={showCoinBalance}
                        iconData={coin.logoFile ? coin.logoFile : null}
                        key={key}
                        selected={selected}
                        onClick={onClick}
                    />
                )
        } else {
            return (<div>Loading...</div>)
        }
    }
}

const mapStateToProps = state => {
    return {
        coinLoading: state.coin.loading,
        coinList: state.coin.coinList,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onGetBalance: (symbol, coinAddress) => dispatch(actions.coinGetBalance(symbol, coinAddress)),
    }
};

export default connect(mapStateToProps,mapDispatchToProps)(CoinSelectItem);
