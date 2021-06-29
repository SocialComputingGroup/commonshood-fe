import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type CoinInitialState = {
    error: string | null,
    loading: boolean,
    balanceLoading: boolean,
    mintLoading: boolean,
    coinCreated: boolean,
    coinMintingAfterCreation: boolean,
    coinSent: boolean,
    coinSentMining: boolean,
    coinMinted: boolean,
    coinBalance: {
        symbol: string | null,
        balance: string | null, //TODO check if this is indeed a number OR a string
    },
    loadingTransactions: boolean,
    transactions: any[], //TODO fix this, we need to define a type for transactions

    coinList: any[], //TODO fix this
    coinListForPiggies: any[], //TODO fix this
    loadingCoinListForPiggies: boolean,
    preselectedCoin: any | undefined, //TODO fix this

    iconsCache: Map<any, any>,//TODO fix this
};

const initialState : CoinInitialState = {
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

export const coinSlice = createSlice({
    name: 'coin',
    initialState,
    reducers:{
        //coin creation reducers:
        coinCreateReset(state, action){
            state.coinCreated = false;
            state.coinMintingAfterCreation = false;
            state.loading = false;
            state.error = null;
        },
        coinCreateStart(state, action){
            state.coinCreated = false;
            state.coinMintingAfterCreation = false;
            state.loading = true;
        },
        coinCreateSuccess(state, action){ 
            state.loading = false; 
            state.coinCreated = true
        },
        coinMintAfterCreation(state, action){
            state.coinMintingAfterCreation = true;
        },
        coinCreateFail(state, action: PayloadAction<{error: any}>){ 
            state.loading = false;
            state.error = action.payload.error;
        },
        //=========================================================
        //coin get list of user
        coinGetListStart(state, action){
            state.loading = true;
        },
        coinGetListSuccess(state, action: PayloadAction<{coinList: any[]}>){ //TODO fixme action type
            state.loading = false;
            state.coinList = action.payload.coinList;
        },
        coinGetListFail(state, action: PayloadAction<{error: string}>){
            state.loading = false;
            state.error =  action.payload.error;
        },
        coinGetListReset(state, action){
            state.loading = false;
            state.coinList = []; //CHECK THIS, in original store was setting at null
        },
        //=========================================================
        //coin get list for piggies
        coinForPiggiesGetListReset(state, action){
            state.loadingCoinListForPiggies = false;
            state.coinListForPiggies = [];
        },
        coinForPiggiesGetListStart(state, action){
            state.loadingCoinListForPiggies = true;
        },
        coinForPiggiesGetListSuccess(state, action: PayloadAction<{coinListForPiggies: any[]}> ){
            state.loadingCoinListForPiggies = false,
            state.coinListForPiggies = action.payload.coinListForPiggies
        },
        coinForPiggiesGetListFail(state, action: PayloadAction<{error: string}>){
            state.loadingCoinListForPiggies = false;
            state.error = action.payload.error;
        },
        //=========================================================
        //coin get list filtered:
        coinGetAllOwnedStart(state, action){
            state.loading = true;
            state.error = null;
        },
        coinGetAllOwnedSuccess(state, action: PayloadAction<{coinList: any[]}>){
            state.loading = false;
            state.coinList = action.payload.coinList;
        },
        coinGetAllOwnedFail(state, action: PayloadAction<{error: string}> ){
            state.loading = false;
            state.error = action.payload.error;
        },
        //========================================================
        //Get balance of specific coin (from symbol) 
        //TODO potentially remove this from store and use it directly in the components?
        coinGetBalanceStart(state,action){
            state.balanceLoading = true;
        },
        coinGetBalanceSuccess(state, action: PayloadAction<{coinBalance: {balance: number, symbol: string}, forPiggies: boolean }> ){
            const newBalance = action.payload.coinBalance;
            if(action.payload.forPiggies){ //working with the piggies' coinlist
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
        
                state.coinListForPiggies = piggiesCoinList;
        
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
        
                state.coinList = coinList;
            }
        },
        coinGetBalanceFail(state, action: PayloadAction<{error: string}>){
            state.balanceLoading = false;
            state.error = action.payload.error;
        },
        //=============================================================
        //sending coins
        coinSendStart(state, action){
            state.coinSent = false;
            state.loading = true; 
            state.coinSentMining = false;
        },
        coinSendMining(state, action){
            state.coinSentMining =true;
        },
        coinSendSuccess(state, action){
            state.loading = false;
            state.coinSent = true; 
            state.coinSentMining = false;
        },
        coinSendFail(state, action: PayloadAction<{error: string}>){
            state.loading = false;
            state.coinSent = false;
            state.coinSentMining = false;
            state.error = action.payload.error;
        },
        coinSendReset(state, action){
            state.loading = false;
            state.coinSent = false;
            state.error = null;
        },
        //=================================================================
        //minting coins
        coinMintStart(state, action){
            state.coinMinted = false;
            state.mintLoading = true;
        },
        coinMintSuccess(state, action){
            state.mintLoading = false; 
            state.coinMinted = true;
        },
        coinMintFail(state, action: PayloadAction<{error: string}>){
            state.mintLoading = false;
            state.coinMinted = false;
            state.error = action.payload.error;
        },
        coinMintReset(state, action){
            state.mintLoading = false;
            state.coinMinted = false;
            state.error = null;
        },
        //===================================================================
        //transactions
        coinTransactionsStart(state, action){
            state.loadingTransactions = true; 
            state.transactions = [];
        },
        coinTransactionsSuccess(state, action: PayloadAction<{transactions: any[]}>){ //TODO fixme
            state.transactions = action.payload.transactions;
            state.loadingTransactions = false; 
        },
        coinTransactionsFail(state, action: PayloadAction<{error: string}>){
            state.loadingTransactions = false;
            state.error = action.payload.error;
        },
        //===================================================================
        //preselection coin
        coinSetPreselected(state, action: PayloadAction<{coin: any}>){//TODO fixme    
            state.preselectedCoin = action.payload.coin;
        },
        coinUnsetPreselected(state, action){
            state.preselectedCoin = undefined;
        },        
        //===================================================================
        //icons
        coinAddIcon(state, action: PayloadAction<{symbol: string, icon: string}>){//TODO check icon is really a string
            const newIconsCache = new Map(state.iconsCache);
            newIconsCache.set(action.payload.symbol, action.payload.icon);
            state.iconsCache = newIconsCache;
        },
        
    }
})

export const {} = coinSlice.actions;

export default coinSlice.reducer;