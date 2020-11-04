import * as actionTypes from './actionTypes';

import { notificationListenToBlockchain } from "./notification"
import {logger} from '../../utilities/winstonLogging/winstonInit';
import config from '../../config';

// axios Authenticated wrapper for strongloop REST queries
import axiosAuth from '../../utilities/backend/axios-strongloop';

import Web3 from "web3";


const ETH_POA_NETWORK_ID = config.blockchain.networkID;

export const web3StartCheck = () => {
    return {
        type: actionTypes.WEB3_START_CHECK,
    };
};

export const web3Set = (isMetamaskInstalled, provider, web3Instance, metamaskStatus) => {
    if(!isMetamaskInstalled){
        return {
            type: actionTypes.WEB3_SET_METAMASK_PRESENCE,
            isMetamaskInstalled,
            provider: null,
            web3Instance: null,
            currentAccount: null,
        };
    }
    return {
        type: actionTypes.WEB3_SET_METAMASK_PRESENCE,
        isMetamaskInstalled,
        provider,
        web3Instance,
        currentAccount: metamaskStatus != null ? metamaskStatus.accounts[0] : null,
    };
};

export const  web3CheckMetamaskPresence = (subscribeWeb3Events) => {
    return async (dispatch, getState) => {
        try{
            dispatch(web3StartCheck());
            const provider = window.ethereum;
            if (typeof provider !== 'undefined') {
                logger.info('METAMASK installed and found');

                //checking initial balance here
                await provider.enable(); // without this metamask won't authorize any action, not even getting the account
                const web3 = new Web3( provider );
                const metamaskStatus = await isMetamaskLocked(web3);
                const isCorrectNetwork = await isMetamaskNetworkCorrect(web3);
                if( !metamaskStatus.locked && metamaskStatus.accounts.length > 0 && isCorrectNetwork){
                    await checkMetamaskBalance(web3, metamaskStatus.accounts[0]); //just checking one account for now!
                    dispatch(web3Set(true, provider, web3, metamaskStatus));
                    if (subscribeWeb3Events) dispatch(notificationListenToBlockchain(web3, metamaskStatus.accounts[0]))

                    //getBackendBankForUser(getState().user.currentProfile.id);
                    setBackendWalletsForUser(getState().user.currentProfile.id, metamaskStatus.accounts[0]);
                }else{
                    logger.info('METAMASK on wrong blockchain address or locked');
                    dispatch( web3Set(false));
                }
            }else{
                logger.info('METAMASK not found'); 
                dispatch( web3Set(false));
            }
        }catch(error){
            logger.info(`an error occurred: ${error} `);
            dispatch( web3Set(false));
        }
    }
};

const isMetamaskNetworkCorrect = async (web3) => {
    const networkId = await web3.eth.net.getId();
    if(networkId !== ETH_POA_NETWORK_ID){
        logger.debug(`metamask network id: ${networkId}, expected ${ETH_POA_NETWORK_ID}`);
        return false;
    }else{
        logger.debug(`we are in the correct metamask network id ${networkId}`);
        return true;
    }
}

const isMetamaskLocked = async (web3) => {
    return await new Promise ((resolve, reject) => { //promisifing a callback

        web3.eth.getAccounts( (err, accounts) => {
            if( err != null){
                logger.error(err);
                reject( {
                    locked: true,
                });
            }else if(accounts.length === 0){
                logger.debug('metamask is probably locked');
                reject({
                    locked: true,
                });
            }else{
                logger.debug('metamask is unlocked');
                logger.debug('metamask ACCOUNTS ', accounts);
                resolve({
                    locked: false,
                    accounts
                });
            }
        })
    });
};

const checkMetamaskBalance = async (web3, accountAddress) => {
    const balance = await web3.eth.getBalance(accountAddress);
    let convertedBalance;
    if(web3.utils.isHexStrict(balance)){
        convertedBalance = web3.utils.fromWei(web3.utils.toDecimal(balance), "ether");
    }else {
        convertedBalance = web3.utils.fromWei(balance, "ether");
    }
    logger.info('METAMASK ACCOUNT BALANCE: ', convertedBalance);
};

const getBackendWalletsForUser = async (userId) => {
    let params = {};
    const filter = `{"where": {"userId": "${userId}" }}`
    const res = await axiosAuth.get('/Bank?filter=' + filter, params);
    
    return res.data[0];
}

const setBackendWalletsForUser = async (userId, currentAddress) => {
    const currentBank = await getBackendWalletsForUser(userId);

    let putData = {};
    if(currentBank !== undefined){
        if( currentBank.currently_active_wallet === currentAddress){
            return; // backend Wallets are already updated
        }

        const wallets = currentBank.wallets;
        if( !wallets.includes(currentAddress) ){
            wallets.push(currentAddress);
        }

        putData = {
            id:  currentBank.id,
            userId: userId,
            currently_active_wallet: currentAddress,
            wallets: wallets,
        };
    }else{ //first login ever with an active wallet
        putData = {
            userId: userId,
            currently_active_wallet: currentAddress,
            wallets: [currentAddress],
        };
    }

    const res = await axiosAuth.put('/Bank', putData);
    
    
}