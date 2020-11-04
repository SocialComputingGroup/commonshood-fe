import {assetDecimalRepresentationToInteger, assetIntegerToDecimalRepresentation} from '../../utilities/decimalsHandler/decimalsHandler';
//Import axios HOC for REST Call to strongloop
import axios from '../../utilities/backend/axios-strongloop';
import {logger} from '../../utilities/winstonLogging/winstonInit';
import config from '../../config';

import {assetsType} from '../../config/assets';

// Import action types
import * as actionTypes from './actionTypes';
//import {authSuccess} from "./auth";

//logo for resources which are missing one
import roundQuestionMark from '../../assets/img/iconMissing/roundQuestionMark.png';

//Coin Creation
export const coinCreateStart = () => {
    return {
        type: actionTypes.COIN_CREATE_START
    }
};

export const coinCreateSuccess = () => {
    return {
        type: actionTypes.COIN_CREATE_SUCCESS
    }
};

export const coinAfterCreationStartMinting = () => {
    return { 
        type: actionTypes.COIN_MINT_AFTER_CREATION
    };
};

export const coinCreateFail = (error) => {
    return {
        type: actionTypes.COIN_CREATE_FAIL,
        error: error
    }
};

export const coinCreateReset = () => {
    return {
        type: actionTypes.COIN_CREATE_RESET
    }
};

//Coin List get
export const coinGetListStart = () => {
    return { type: actionTypes.COIN_GET_LIST_START}
};
export const coinGetListSuccess = (coinList) => {
    return {
        type: actionTypes.COIN_GET_LIST_SUCCESS,
        coinList: coinList
    }
};
export const coinGetListFail = (error) => {
    return {
        type: actionTypes.COIN_GET_LIST_FAIL,
        error: error
    }
};

export const coinGetListReset = () => {
    return {
        type: actionTypes.COIN_GET_LIST_RESET
    }
};

//Coin List get from Person
export const coinGetAllOwnedStart = () => {
    return { type: actionTypes.COIN_GET_ALL_OWNED_START}
};
export const coinGetAllOwnedSuccess = (coinList) => {
    return {
        type: actionTypes.COIN_GET_ALL_OWNED_SUCCESS,
        coinList: coinList
    }
};
export const coinGetAllOwnedFail = (error) => {
    return {
        type: actionTypes.COIN_GET_ALL_OWNED_FAIL,
        error: error

    }
};

//Coin get Balance (from symbol)
export const coinGetBalanceStart = () => {
    return {
        type: actionTypes.COIN_GET_BALANCE_START
    }
};

export const coinGetBalanceSuccess = (coinBalance, forPiggies) => {
    return {
        type: actionTypes.COIN_GET_BALANCE_SUCCESS,
        coinBalance: coinBalance,
        forPiggies
    }
};

export const coinGetBalanceFail = (error) => {
    return {
        type: actionTypes.COIN_GET_BALANCE_FAIL,
        error: error
    }
};

export const coinGetBalanceReset = () => {
    return {
        type: actionTypes.COIN_GET_BALANCE_RESET
    }
};

//Coin Send
//Coin Creation
export const coinSendStart = () => {
    return {
        type: actionTypes.COIN_SEND_START
    }
};

export const coinSendMining = () => {
    return {
        type: actionTypes.COIN_SEND_MINING
    }
};

export const coinSendSuccess = () => {
    return {
        type: actionTypes.COIN_SEND_SUCCESS
    }
};

export const coinSendFail = (error) => {
    return {
        type: actionTypes.COIN_SEND_FAIL,
        error: error
    }
};

export const coinSendReset = () => {
    return {
        type: actionTypes.COIN_SEND_RESET
    }
};

//coinMint
export const coinMintStart = () => {
    return {
        type: actionTypes.COIN_MINT_START
    }
};

export const coinMintSuccess = () => {
    return {
        type: actionTypes.COIN_MINT_SUCCESS
    }
};

export const coinMintFail = (error) => {
    return {
        type: actionTypes.COIN_MINT_FAIL,
        error: error
    }
};

export const coinMintReset = () => {
    return {
        type: actionTypes.COIN_MINT_RESET
    }
};

export const coinTransactionsStart = () => {
    return {
        type: actionTypes.COIN_TRANSACTIONS_START
    }
};

export const coinTransactionsSuccess = (transactions) => {
    return {
        type: actionTypes.COIN_TRANSACTIONS_SUCCESS,
        transactions: transactions
    }
};

export const coinTransactionsFail = (error) => {
    return {
        type: actionTypes.COIN_TRANSACTIONS_FAIL,
        error: error
    }
};

export const coinSetPreselected = (coin) => {
    return{
        type: actionTypes.COIN_SET_PRESELECTED,
        coin
    }
};

export const coinUnsetPreselected = () => {
    return{
        type: actionTypes.COIN_UNSET_PRESELECTED,
    }
};


//Coin get list for piggies
export const coinForPiggiesGetListStart = () => {
    return{
        type: actionTypes.COIN_FOR_PIGGIES_GET_LIST_START
    }
}

export const coinForPiggiesGetListReset = () => {
    return{
        type: actionTypes.COIN_FOR_PIGGIES_GET_LIST_RESET
    }
}

export const coinForPiggiesGetListSuccess = (coinListForPiggies) => {
    return{
        type: actionTypes.COIN_FOR_PIGGIES_GET_LIST_SUCCESS,
        coinListForPiggies
    }
}

export const coinForPiggiesGetListFail = (error) => {
    return{
        type: actionTypes.COIN_FOR_PIGGIES_GET_LIST_FAIL,
        error
    }
}

// add icon to cache
export const coinAddIconToCache = (symbol, icon) => {
    return {
        type: actionTypes.COIN_ADD_ICON,
        symbol,
        icon
    }
}


const getCoinType = (decimals) => {
    if(decimals === 0){
        return assetsType.goods.name;
    }
    return assetsType.token.name;
};

const getDecimalsByCoinType = (type) => {
    if(type === assetsType.goods.name)
        return assetsType.goods.decimals;
    return assetsType.token.decimals;
};

// Async Actions
//coin creation from data
export const coinCreate = (coinData) => {

    return async (dispatch, getState) => {
        dispatch(coinCreateStart());
        const configFileHeader = {
            headers: {
                'content-type': 'multipart/form-data',
                'Access-Control-Allow-Origin': '*'
            }
        };

        const {
            name,
            symbol,
            description,
            decimals,
            initialSupply,
            iconFile,
            contractFile,
            type
        } = coinData;

        let iconHash = null;
        let iconUrl = null;
        let contractHash = null;

        try{
            // Upload Icon File
            let formData = new FormData();
            formData.append('file', iconFile);
            let response = await axios.post('/Resources/upload', formData, configFileHeader);
            iconHash = response.data.file.hash;
            iconUrl = response.data.file.url;

            // Upload Contract File
            formData = new FormData();
            formData.append('file', contractFile);
            response = await axios.post('/Resources/upload', formData, configFileHeader);
            contractHash = response.data.file.hash;

            //const currentProfile = getState().user.currentProfile;
            //const realm = currentProfile.realm;

            //we are using metamask?
            const web3 = getState().web3.web3Instance;
            try{
                const accountAddress = getState().web3.currentAccount;

                const tokenFactoryInstance = new web3.eth.Contract(
                    config.smartContracts.TKN_FCTRY_ABI,
                    config.smartContracts.TKN_FCTRY_ADDR,
                );
                const creationResponse = await tokenFactoryInstance.methods.createToken(
                    name,
                    symbol,
                    decimals,
                    iconUrl,
                    iconHash,
                    0, //cap
                    contractHash,
                ).send({from: accountAddress, gasPrice: "0"});
                logger.info('metamask succesfully created res: ', creationResponse); 

                dispatch(coinAfterCreationStartMinting());

                const justCreatedTokenAddress = creationResponse.events.TokenAdded.returnValues[2];
                const justCreatedTokenInstance = new web3.eth.Contract(
                    config.smartContracts.TKN_TMPLT_ABI,
                    justCreatedTokenAddress,
                );
                
                const mintingResponse = await justCreatedTokenInstance.methods.mint(
                    accountAddress,
                    parseInt(assetDecimalRepresentationToInteger(initialSupply, decimals)),
                ).send({from: accountAddress, gasPrice: "0"});
                logger.info('metamask succesfully minted res: ', mintingResponse); 

                dispatch(coinCreateSuccess());
                dispatch(coinAddIconToCache(symbol, iconFile));
            }catch(error){
                //TODO
                logger.debug('Something went bad while creating coin via metamask:', error);
                dispatch(coinCreateFail(error));
            }
        }catch(error){
            dispatch(coinCreateFail(error));
        }
    }
};

//Get list of coins from backend
export const coinGetList = (type, withBalance=true, onlyOwned=false, forPiggies, tokensAddressesArrayFilter) => {
    return async (dispatch, getState) => {
        if(forPiggies){
            dispatch (coinForPiggiesGetListReset());
            dispatch (coinForPiggiesGetListStart());
        }else{
            dispatch (coinGetListReset());
            dispatch (coinGetListStart());
        }

        let coinsList = [];
        const web3 = getState().web3.web3Instance;
        try{
            const accountAddress = getState().web3.currentAccount;
            const TokenFactoryInstance = new web3.eth.Contract(
                config.smartContracts.TKN_FCTRY_ABI,
                config.smartContracts.TKN_FCTRY_ADDR,
            );
            let tokensAddresses = [];
            if(onlyOwned){
                tokensAddresses = await TokenFactoryInstance.methods.getPossessedTokens(
                        accountAddress,
                ).call({from: accountAddress, gasPrice: "0"});
                logger.debug('[coin - coinGetList] metamask getPossessedTokens success res: ', tokensAddresses); 
            }else{
                tokensAddresses = await TokenFactoryInstance.methods.getAllTokenAddresses()
                    .call({from: accountAddress, gasPrice: "0"});
                logger.debug('[coin - coinGetList] metamask getAllTokenAddresses success res: ', tokensAddresses);
            }

            if(tokensAddressesArrayFilter != null){ //apply extra filter, we want just some of these addresses
                tokensAddresses = tokensAddresses.filter( address => {
                    return tokensAddressesArrayFilter.includes(address);
                });
            }
            
            if(tokensAddresses.length !== 0){ //this user posses some coin
                let tokensExtendedData = tokensAddresses.map( (tokenTemplateAddress) => {
                    return TokenFactoryInstance.methods['getToken(address)']( //we have to call it this way because it is an overloaded function
                            tokenTemplateAddress
                        ).call({from: accountAddress, gasPrice: "0"});
                });
                tokensExtendedData = await Promise.all(tokensExtendedData);
                //logger.debug("[coin - coinGetList] metamask ttt" + JSON.stringify(tokensExtendedData[0]));return;

                const tokenInstances = tokensAddresses.map( (tokenTemplateAddress) => {
                    return new web3.eth.Contract(
                        config.smartContracts.TKN_TMPLT_ABI,
                        tokenTemplateAddress,
                    );
                });
                
                let logo = null;
                for(let i = 0; i < tokenInstances.length; i++){
                    const tokenInstance = tokenInstances[i];
                    const tokenExtendedData = tokensExtendedData[i];

                    const coinOwner= tokenExtendedData[5]; //5 is the owner, see getToken in TokenFactory contract!
                    const name = tokenExtendedData[1];
                    const symbol = tokenExtendedData[2];
                    const decimals = parseInt(tokenExtendedData[3]);
                    const logoHash = await tokenInstance.methods.logoHash().call({from: accountAddress, gasPrice: "0"});
                    const contractHash = await tokenInstance.methods.contractHash().call({from: accountAddress, gasPrice: "0"});
                    

                    //check if the logo is already in redux cache
                    const iconsCache = getState().coin.iconsCache;
                    if(iconsCache.has(symbol)){ //yes it is
                        logger.info(`icon for ${symbol} in cache`);
                        logo = iconsCache.get(symbol);
                    }else{ //get it from api
                        logger.info(`icon for ${symbol} NOT in cache`);
                        let logoResponse;
                        try{
                            logoResponse = await axios.get(`/Resources/get/${logoHash}`);
                            logo = logoResponse.data.file.body;
                        }catch(error){ //logo not found on server
                            logo = roundQuestionMark;
                        }
                        //set it in redux iconsCache
                        dispatch(coinAddIconToCache(symbol, logo));
                    }

                    let computedBalance = null;
                    if (withBalance) {
                        try{
                            const balance = await tokenInstance.methods.balanceOf(accountAddress).call({from: accountAddress});
                            computedBalance = assetIntegerToDecimalRepresentation(balance, decimals);
                            if(decimals === 0){
                                computedBalance = parseInt(computedBalance);
                            }
                            logger.info(`metamask Balance for ${symbol} is ${computedBalance} with ${decimals} decimals`);
                        }catch(_){
                            computedBalance = -1;
                        }
                    }

                    const coinData = {
                        address: tokensAddresses[i],
                        symbol: symbol,
                        logo: logoHash,
                        logoFile: logo,
                        balance: computedBalance,
                        decimals: decimals,
                        //cap: coinItem.cap, //not needed
                        name: name,
                        //userId: coinItem.userId, //here i need the creator address instead 
                        addressOfOwner: coinOwner, 
                        //description: coinItem.description, //TODO Add in contract first
                        ownerType: "user",//coinItem.ownerType,
                        contractHash: contractHash,
                        type: getCoinType(decimals),
                    }
                    coinsList.push(coinData);
                };
            }

            if(coinsList.length !== 0 && type !== null){
                //filter on type
                //const expectedDecimals = getDecimalsByCoinType(type);
                //coinsList = coinsList.filter( coin => coin.decimals === expectedDecimals );
                coinsList = coinsList.filter( coin => coin.type === type );
            }

            //if the user did not posses coin, coinsList is still === []
            if(forPiggies){
                dispatch(coinForPiggiesGetListSuccess(coinsList));
                return;
            }else{
                dispatch(coinGetListSuccess(coinsList));
                return;
            }


        }catch(error){
            logger.debug('[coin - coinGetList] via metamask, something went wrong:', error);
            dispatch(coinCreateFail(error));
            return;
        }

    }
};


export const coinGetBalance = (symbol, coinAddress, forPiggies) => {
    logger.info(`request balance for ${symbol} with address ${coinAddress}`);
    return async (dispatch, getState) => {
        dispatch(coinGetBalanceReset());
        const web3 = getState().web3.web3Instance;
        try{
            const accountAddress = getState().web3.currentAccount;

            const coinContractInstance = new web3.eth.Contract(
                config.smartContracts.TKN_TMPLT_ABI,
                coinAddress
            );

            const tickerBalance = await coinContractInstance.methods.balanceOf(accountAddress).call({from: accountAddress});
            const decimals = await coinContractInstance.methods.decimals().call();
            logger.info(`metamask Balance for ${symbol} is ${tickerBalance} with ${decimals} decimals`);

            let balance = assetIntegerToDecimalRepresentation(tickerBalance, decimals);
            if(decimals === 0){
                balance = parseInt(balance);
            }

            const coinBalance = {
                symbol: symbol,
                balance: balance,
                decimals: decimals,
            };
            dispatch(coinGetBalanceSuccess(coinBalance, forPiggies));
        }catch(error){
            logger.debug(`error while retriving balance for ${symbol}: ${error}`);
            dispatch(coinGetBalanceSuccess({symbol: symbol, balance: -1, error: error}, forPiggies));
        }
    }
};


export const coinSend = (coinData) => {
    return async (dispatch, getState) => {
        logger.info("COIN DATA" + JSON.stringify(coinData));

        const currentProfile = getState().user.currentProfile;
        const destUser = coinData.destUser;
        const symbol = coinData.symbol;
        const decimals = coinData.decimals;
        const amount = parseInt(assetDecimalRepresentationToInteger(coinData.amount, decimals));

        const web3 = getState().web3.web3Instance;
        try{

            const TokenFactoryInstance = new web3.eth.Contract(
                config.smartContracts.TKN_FCTRY_ABI,
                config.smartContracts.TKN_FCTRY_ADDR,
            );
            const tokenData = await TokenFactoryInstance.methods['getToken(string)']( //we have to call it this way because it is an overloaded function
                symbol
            ).call({from: accountAddress, gasPrice: "0"});
            const tokenAddress = tokenData[0]


            const filter = `{"where": {"userId": "${destUser.id}" }}`
            const res = await axios.get('/Bank?filter=' + filter, );
            const receiverWalletAddress = res.data[0].currently_active_wallet;

            dispatch(coinSendStart());
            const accountAddress = getState().web3.currentAccount;
            const tokenInstance = new web3.eth.Contract(
                config.smartContracts.TKN_TMPLT_ABI,
                tokenAddress,
            );
            dispatch(coinSendMining());
            await tokenInstance.methods.transfer(receiverWalletAddress, amount).send({from: accountAddress, gasPrice: '0'});
            dispatch(coinSendSuccess());
        }catch(error){
            logger.error('[sendCoin action error] =>', error);
            dispatch(coinSendFail(error.response ? error.response.statusText : 'Error in coinsend'));
        }
    };
};


//coin Mint amount to wallet
export const coinMint = (tokenAddress, amount, decimals) => {
    return async (dispatch, getState) => {
        dispatch(coinMintStart());
        const web3 = getState().web3.web3Instance;
        try{
            const accountAddress = getState().web3.currentAccount;
            const tokenInstance = new web3.eth.Contract(
                config.smartContracts.TKN_TMPLT_ABI,
                tokenAddress,
            );
            
            const mintingResponse = await tokenInstance.methods.mint(
                accountAddress,
                parseInt(assetDecimalRepresentationToInteger(amount, decimals)),
            ).send({from: accountAddress, gasPrice: "0"});

            dispatch(coinMintSuccess());
            
            logger.info('metamask succesfully minted res: ', mintingResponse); 
        }
        catch(error) {
            logger.error("error in coin mint ", error);
            dispatch(coinMintFail(error));
        }
    }
};

//coin transactions
export const coinTransactions = (symbol, decimals) => {
    return (dispatch,getState) => {
        dispatch(coinTransactionsStart());
        dispatch(coinTransactionsSuccess([]));  //todo
        // const currentProfile = getState().user.currentProfile;
        // let url = '/Coins/'+ symbol + '/MyTransactions';
        // if(currentProfile.realm === "dao")
        // {
        //     url = '/DAOS/'+currentProfile.id+'/getTransactionsOf/'+symbol;
        // }
        // axios.get(url)
        //     .then(response => {
        //         const transactions = response.data.map((item,index) => {
        //             if (item.from.id !== -1){
        //                 return {
        //                     ...item,
        //                     value: assetIntegerToDecimalRepresentation(item.value, decimals),
        //                     decimals: decimals,
        //                 };
        //             }else{
        //                 return item;
        //             }
        //         });

        //         dispatch(coinTransactionsSuccess(transactions));
        //     })
        //     .catch(error => {
        //         logger.error('coinTransactions error',error);
        //         dispatch(coinTransactionsFail(error.response ? error.response.statusText : 'Transactions get ERROR'));
        //     })
    }
};

