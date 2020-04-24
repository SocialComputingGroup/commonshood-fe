// Coin Reducer for coin management actions

//Importing action types
import * as actionTypes from '../actions/actionTypes';

//Utility for updating the state in a leaner way
import { updateObject } from '../../utilities/utilities';

const initialState = {
    error: null,
    loading: false,
    balanceLoading: false,
    mintLoading: false,
    coinCreated: false,
    coinMintingAfterCreation: false,
    coinSent: false,
    coinSentMining: false,
    coinMinted: false,
    coinBalance: {
        symbol: null,
        balance: null
    },
    loadingTransactions: false,
    transactions : [],

    coinList: [],

    coinListForPiggies: [],
    loadingCoinListForPiggies: false,

    preselectedCoin: undefined, //{ticker, icon, type}

    //contractsCache: new Map(),
    iconsCache: new Map(),
};


//Coin creation reducers
const coinCreateStart = (state, action) => {
    return {
        ...state,
        coinCreated: false, 
        coinMintingAfterCreation: false,
        loading: true
    };
};

const coinCreateSuccess = (state, action) => {
    return {
        ...state, 
        loading: false, 
        coinCreated: true
    };
};

const coinMintAfterCreation = (state, action) => {
    return {
        ...state,
        coinMintingAfterCreation: true
    };
};

const coinCreateFail = (state, action) => {
    return {
        ...state, 
        loading: false, 
        error: action.error
    };
};

const coinCreateReset = (state, action) => {
    return initialState;
};

//Coin get list for users ==============================================
const coinGetListStart = (state, action) => {
    return updateObject(state, {
        loading: true
    })
};

const coinGetListSuccess = (state, action) => {
    return updateObject(state,
        {
            loading: false,
            coinList: action.coinList
        })
};

const coinGetListFail = (state, action) => {
    return updateObject(state, {
        loading: false,
        error: action.error
    })
};

const coinGetListReset = (state, action) => {
    return updateObject(state,
        {
            loading: false,
            coinList: null
        })
};

//get list for piggies: ===================================================
const coinForPiggiesGetListReset = (state, action) => {
    return {
        ...state,
        loadingCoinListForPiggies: false,
        coinListForPiggies: []
    };
};

const coinForPiggiesGetListStart = (state, action) => {
    return {
        ...state,
        loadingCoinListForPiggies: true,
    };
};

const coinForPiggiesGetListSuccess = (state, action) => {
    return{
        ...state,
        loadingCoinListForPiggies: false,
        coinListForPiggies: action.coinListForPiggies
    };
};

const coinForPiggiesGetListFail = (state, action) => {
    return{
        ...state,
        loadingCoinListForPiggies: false,
        error: action.error,
    };
};


//Coin get list from Person
//Coin get list reducers
const coinGetAllOwnedStart = (state, action) => {
    return updateObject(state, {
        loading: true,
        error: null
    })
};

const coinGetAllOwnedSuccess = (state, action) => {
    return updateObject(state,
        {
            loading: false,
            coinList: action.coinList
        })
};

const coinGetAllOwnedFail = (state, action) => {
    return updateObject(state, {
        loading: false,
        error: action.error
    })
};

//Get balance of specific coin (from symbol)
const coinGetBalanceStart = (state,action) => {
    return updateObject( state, {
        balanceLoading: true
        }
    )
};

const coinGetBalanceSuccess = (state, action) => {
    const newBalance = action.coinBalance;
    if(action.forPiggies){ //working with the piggies' coinlist
        if(state.coinListForPiggies == null || state.coinListForPiggies.length === 0){
            return state;
        }
        const piggiesCoinList = [...state.coinListForPiggies];
        const coinToUpdateIndex = piggiesCoinList.findIndex( item => item.symbol === newBalance.symbol);
        if(coinToUpdateIndex === -1){
            return state;
        }
        const coinToUpdateItem = piggiesCoinList[coinToUpdateIndex];

        piggiesCoinList[coinToUpdateIndex] = {...coinToUpdateItem, balance: newBalance.balance };

        return {...state, piggiesCoinList: piggiesCoinList};

    }else{
        if(state.coinList == null || state.coinList.length === 0){
            return state;
        }
        const coinList = [...state.coinList];
        const coinToUpdateIndex = coinList.findIndex(item => item.symbol === newBalance.symbol);
        if(coinToUpdateIndex === -1){
            return state;
        }
        const coinToUpdateItem = coinList[coinToUpdateIndex];

        coinList[coinToUpdateIndex] = {...coinToUpdateItem, balance: newBalance.balance};

        return {...state, coinList: coinList};
    }
};


const coinGetBalanceFail = (state, action) => {
    return updateObject(state, {
        balanceLoading: false,
        error: action.error
    })
};

// const coinGetBalanceReset = (state, action) => {
//     const resetBalance = {
//         symbol: null,
//         balance: null
//     }
//
//     return updateObject(state, {
//         loading: false,
//         coinBalance: resetBalance
//     })
// }

//Coin send reducers
const coinSendStart = (state, action) => {
    return updateObject(state,{coinSent: false, loading: true, coinSentMining: false,});
};

const coinSendMining = (state, action) => {
    return {
        ...state,
        coinSentMining: true,
    };
}

const coinSendSuccess = (state, action) => {
    return updateObject(state, {loading: false, coinSent: true, coinSentMining: false,})
};

const coinSendFail = (state, action) => {
    return updateObject (state, {
        loading: false,
        coinSent: false,
        coinSentMining: false,
        error: action.error})
};

const coinSendReset = (state, action) => {
    return updateObject (state, {
        loading: false,
        coinSent: false,
        error: null})
};

//Coin send reducers
const coinMintStart = (state, action) => {
    return updateObject(state,{coinMinted: false, mintLoading: true});
};

const coinMintSuccess = (state, action) => {
    return updateObject(state, {mintLoading: false, coinMinted: true})
};

const coinMintFail = (state, action) => {
    return updateObject (state, {
        mintLoading: false,
        coinMinted: false,
        error: action.error})
};

const coinMintReset = (state, action) => {
    return updateObject (state, {
        mintLoading: false,
        coinMinted: false,
        error: null})
};

const coinTransactionsStart = (state, action) => {
    return updateObject(state, { loadingTransactions: true, transactions: [] })
};

const coinTransactionsSuccess = (state, action) => {
    const newTransactions = action.transactions;
    return updateObject(state, {loadingTransactions: false, transactions : newTransactions})
};

const coinTransactionsFail = (state, action) => {
    return updateObject (state, {
        loadingTransactions: false,
        error: action.error})
};


const coinSetPreselected = (state, action) => {
    return {
        ...state,
        preselectedCoin: action.coin
    }
};

const coinUnsetPreselected = (state, action) => {
    return{
        ...state,
        preselectedCoin: undefined
    }
};


const coinAddIcon = (state, action) => {
    const newIconsCache = new Map(state.iconsCache);
    newIconsCache.set(action.symbol, action.icon);
    return {
        ...state,
        iconsCache: newIconsCache,
    }
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.COIN_CREATE_START: return coinCreateStart(state,action);
        case actionTypes.COIN_MINT_AFTER_CREATION: return coinMintAfterCreation(state,action);
        case actionTypes.COIN_CREATE_SUCCESS: return coinCreateSuccess(state,action);
        case actionTypes.COIN_CREATE_FAIL: return coinCreateFail(state,action);
        case actionTypes.COIN_CREATE_RESET: return coinCreateReset(state,action);

        case actionTypes.COIN_GET_LIST_START: return coinGetListStart(state,action);
        case actionTypes.COIN_GET_LIST_SUCCESS: return coinGetListSuccess(state,action);
        case actionTypes.COIN_GET_LIST_FAIL: return coinGetListFail(state,action);
        case actionTypes.COIN_GET_LIST_RESET: return coinGetListReset(state,action);

        case actionTypes.COIN_FOR_PIGGIES_GET_LIST_START: return coinForPiggiesGetListStart(state,action);
        case actionTypes.COIN_FOR_PIGGIES_GET_LIST_RESET: return coinForPiggiesGetListReset(state,action);
        case actionTypes.COIN_FOR_PIGGIES_GET_LIST_SUCCESS: return coinForPiggiesGetListSuccess(state,action);
        case actionTypes.COIN_FOR_PIGGIES_GET_LIST_FAIL: return coinForPiggiesGetListFail(state,action);

        case actionTypes.COIN_GET_ALL_OWNED_START: return coinGetAllOwnedStart(state,action);
        case actionTypes.COIN_GET_ALL_OWNED_SUCCESS: return coinGetAllOwnedSuccess(state,action);
        case actionTypes.COIN_GET_ALL_OWNED_FAIL: return coinGetAllOwnedFail(state,action);
        case actionTypes.COIN_GET_BALANCE_START: return coinGetBalanceStart(state,action);
        case actionTypes.COIN_GET_BALANCE_SUCCESS: return coinGetBalanceSuccess(state,action);
        case actionTypes.COIN_GET_BALANCE_FAIL: return coinGetBalanceFail(state,action);
        case actionTypes.COIN_SEND_START: return coinSendStart(state,action);
        case actionTypes.COIN_SEND_MINING: return coinSendMining(state,action);
        case actionTypes.COIN_SEND_SUCCESS: return coinSendSuccess(state,action);
        case actionTypes.COIN_SEND_FAIL: return coinSendFail(state,action);
        case actionTypes.COIN_SEND_RESET: return coinSendReset(state,action);
        case actionTypes.COIN_MINT_START: return coinMintStart(state,action);
        case actionTypes.COIN_MINT_SUCCESS: return coinMintSuccess(state,action);
        case actionTypes.COIN_MINT_FAIL: return coinMintFail(state,action);
        case actionTypes.COIN_MINT_RESET: return coinMintReset(state,action);
        case actionTypes.COIN_TRANSACTIONS_START : return coinTransactionsStart(state,action);
        case actionTypes.COIN_TRANSACTIONS_SUCCESS : return coinTransactionsSuccess(state,action);
        case actionTypes.COIN_TRANSACTIONS_FAIL : return coinTransactionsFail(state,action);
        case actionTypes.COIN_SET_PRESELECTED: return coinSetPreselected(state, action);
        case actionTypes.COIN_UNSET_PRESELECTED: return coinUnsetPreselected(state, action);
        case actionTypes.COIN_ADD_ICON: return coinAddIcon(state,action);
        default: return state;
    }
};

export default reducer;