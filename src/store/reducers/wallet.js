//
// Wallet Reducer for manage Wallet redux actions
//

//Importing action types
import * as actionTypes from '../actions/actionTypes';

//Utility for updating the state in a leaner way
import { updateObject } from '../../utilities/utilities';

const initialState = {
    walletData: null,
    loading: false
};

const walletStart = (state, action) => {
    return updateObject(state, { loading: true })
};

const walletGet = (state, action) => {

    return updateObject(state, { walletData: action.walletData, loading: false });
};

const reducer = (state=initialState, action) => {
    switch (action.type) {
        case actionTypes.WALLET_GET: return walletGet(state,action);
        case actionTypes.WALLET_START: return walletStart(state,action);
        default: return state;
    }
};

export default reducer;