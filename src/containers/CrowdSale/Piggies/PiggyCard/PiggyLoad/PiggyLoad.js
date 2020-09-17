import React, {useState, useEffect} from 'react';
import SlideModal from "../../../../../components/UI/Modal/SlideModal/SlideModal";

//api
import {coinGetBalance} from "../../../../../api/coinAPI";

//redux
import {connect} from "react-redux";

const PiggyLoad = (props) => {
    const {
        open,
        handleClose,
        tokenToGive,
        tokenToGiveAddr,
        tokenToGiveCrowdsaleBalance,

        userWalletAddress,
        web3Instance
    } = props;
    const [ userBalance, setUserBalance ] = useState(0);
    
    useEffect( () => {
        async function loadBalance(){
            const result = await coinGetBalance(web3Instance, userWalletAddress, tokenToGiveAddr);
            setUserBalance(result.balance);
        }
        if(tokenToGive != null) {
            loadBalance();
        }
    }, [tokenToGive]);

    return (
        <SlideModal
            fullscreen={false}
            open={open}
            handleClose={() => handleClose()}
            title="TEMP CHANGE ME"
        >
            <div>TEST TEST TEST CWD BALANCE {tokenToGiveCrowdsaleBalance}</div>
            <div>TEST TEST TEST USER BALANCE {userBalance}</div>
        </SlideModal>
    );
};

const mapStateToProps = state => {
    return{
        userWalletAddress: state.web3.currentAccount,
        web3Instance: state.web3.web3Instance,
    };
};

const mapDispatchToProps = dispatch => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(PiggyLoad);
