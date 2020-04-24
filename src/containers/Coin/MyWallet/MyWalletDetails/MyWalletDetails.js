import React, {Component} from 'react';
import { base64ToArrayBuffer } from '../../../../utilities/utilities'
import {withTranslation} from "react-i18next";


import * as actions from "../../../../store/actions";
import {connect} from "react-redux";
import asyncComponent from "../../../../hoc/AsyncComponent/AsyncComponent";

//Custom async components
const CoinDetails = asyncComponent(()=>import('../../../../components/Coin/CoinDetails/CoinDetails'));
const Loading = asyncComponent(()=>import('../../../../components/UI/Loading/Loading'));


class MyWalletDetails extends Component {

    state = {
        coinOwnerType: null,
        coinUserName: null,
        coinContract: null,
    };

    // Downloads PDF from file source in base64
    downloadContract = (event) => {
        event.preventDefault();

        const { coinContract } = this.state;
        //
        if (coinContract) {
            let arrBuffer = base64ToArrayBuffer(coinContract.body);

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
                link.download = coinContract.name;
                link.click();
                window.URL.revokeObjectURL(data);
                link.remove();
            }
        }
    };

    componentDidMount () {
        const {
            selectedCoin,
            onUserGetData,
            onContractGetData,
            onDaoGetData
        } = this.props;

        const { coinUserName, coinContract } = this.state;

        if (selectedCoin !== null) {
            
            if (!coinUserName) {
                if(selectedCoin.ownerType === 'user'){
                    this.setState({
                        coinOwnerType: 'user'
                    });
                    //onUserGetData(selectedCoin.userId);
                }else if(selectedCoin.ownerType === 'dao'){
                    this.setState({
                        coinOwnerType: 'dao'
                    });
                    //onDaoGetData(selectedCoin.userId);
                }
            }
            if(!coinContract) {
                onContractGetData(selectedCoin.contractHash);
            }
        }
    }

    componentDidUpdate () {

        const {
            userData,
            daoData,
            contractData
        } = this.props;

        const {
            coinUserName,
            coinContract
        } = this.state;

        //getting coin username depends on the ownerType
        // if (!coinUserName) {
        //     if((this.state.coinOwnerType === 'user') && userData){
        //         this.setState ({
        //             coinUserName: userData.name
        //         });
        //     }else if((this.state.coinOwnerType === 'dao') && daoData){
        //         this.setState({
        //             coinUserName: daoData.name
        //         });
        //     }
        // }

        if (contractData && !coinContract) {
            const newContract = { ...contractData };
            this.setState ( { coinContract: newContract});
        }
    }

    render() {
        const {
            t,
            selectedCoin,
            userLoading,
            fileLoading
        } = this.props;
        //
        const {
            coinUserName
        } = this.state;

        let detailRender = ( <Loading withLoader title={ t('loadingCoinDetails') + '...' } /> );

        if ( !fileLoading ) {
             detailRender =
                (
                    <CoinDetails
                        iconData={selectedCoin.logoFile}
                        userName={selectedCoin.address}
                        downloadContract={this.downloadContract}
                        handleClose={this.props.handleClose}
                    >
                        {selectedCoin}
                    </CoinDetails>
                );
        }
        return detailRender;
    }
}
//
const mapStateToProps = state => {
    return {
        userLoading: state.user.loading,
        contractLoading: state.file.loading,
        userData: state.user.user,
        daoData: state.dao.currentDao,
        contractData: state.file.fileData,

        web3account: state.web3.currentAccount,
    }
};


const mapDispatchToProps = dispatch => {
    return {

        onUserGetData: (userId) => dispatch(actions.userGetDataFromId(userId)),
        onDaoGetData: (userId) => dispatch(actions.daoGetDataFromId(userId)),
        onContractGetData: (contractHash) => dispatch(actions.fileGetData(contractHash))
    }
};

MyWalletDetails.propTypes = {};

export default connect(mapStateToProps,mapDispatchToProps) (
                    withTranslation('Common') (MyWalletDetails)
                );