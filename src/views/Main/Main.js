// This is the main view after login
import React from 'react';
//import PropTypes from 'prop-types';

import CoinSend from '../../containers/Coin/Send/CoinSend';
import Piggies from '../../containers/CrowdSale/Piggies/Piggies';
import MyWallet from '../../containers/Coin/MyWallet/MyWallet';

import {connect} from "react-redux";

const Main = (props) => {

    const subpagesComponents = [<CoinSend/>, <Piggies/>, <MyWallet/>,];
    const {subpageIndex} = props;

    return (
        <>
            {subpagesComponents[subpageIndex]}
        </>
    );
};

const mapStateToProps = state => {
    return {
        subpageIndex: state.ui.bottomMenuActiveIndex,
    }
};

const mapDispatchToProps = dispatch => {
    return {}
};

export default connect(mapStateToProps,mapDispatchToProps) (Main);
