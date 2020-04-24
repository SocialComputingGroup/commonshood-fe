import * as actionTypes from '../actions/actionTypes';

const initialState = {
    isMetamaskChecking: false,
    isMetamaskInstalled: undefined,
    provider: null,
    web3Instance: null,
    currentAccount: null,
};

const web3StartCheck = (state, action) => {
    return{
        ...state,
        isMetamaskChecking: true,
    }
};

const web3SetMetamaskPresence = (state, action) => {
    return {
        ...state,
        isMetamaskChecking: false,
        isMetamaskInstalled: action.isMetamaskInstalled,
        provider: action.provider,
        web3Instance: action.web3Instance,
        currentAccount: action.currentAccount,
    };
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.WEB3_SET_METAMASK_PRESENCE: return web3SetMetamaskPresence(state, action);
        case actionTypes.WEB3_START_CHECK: return web3StartCheck(state, action);
        default: return state;
    }
};

export default reducer;
