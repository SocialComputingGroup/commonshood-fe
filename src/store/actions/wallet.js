//
//  Redux Wallet Action dispatchers
//
import {logger} from '../../utilities/winstonLogging/winstonInit';

//Import axios HOC for REST Call to strongloop
import axios from '../../utilities/backend/axios-strongloop';

// Import action types
import * as actionTypes from './actionTypes';

//SYNC Action Creators to be dispatched

//Start loading data
export const walletStart = () => {
    return {
        type: actionTypes.WALLET_START
    }
};

// Get user wallet
export const walletGet = (walletData) => {
    return {
        type: actionTypes.WALLET_GET,
        walletData: walletData
    }
};

//ASYNC dispatchers

//Get user wallet
export const walletGetDataFromUser = () => {
    return dispatch => {
        dispatch (walletStart());
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');

        if (token) {
            axios.get('/Wallets', { params: {
                filter: {"where": {"userId": userId}}
            } })
                .then ((response) => {
                    dispatch (walletGet(response.data[0]));
                })
                .catch( (error) => logger.error(error));
        }
    }
};