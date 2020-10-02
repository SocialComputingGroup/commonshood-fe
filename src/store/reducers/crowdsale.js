
//Importing action types
import * as actionTypes from '../actions/actionTypes';

const initialState = {
    error: null,
    loading: false,
    crowdSaleCreated: false,
    crowdSaleUnlocked: false,
    crowdsales: [],
    participantCoinToJoinBalance: 0,
    participantCoinToJoinLoaded: false,
    participantReservationValue: 0,
    participantReservationLoaded: false,

    approvalPending: false, //describe if the user is currently waiting for a request of "transfer approval" to complete
    pledgePending: false, //describe if the user is currently waiting for a join or a refund to complete
    joined: undefined,
    refunded: undefined,

    crowdsaleStatus: undefined,
    partialReservation: undefined,
    totalReservation: undefined,
    iconsCache: new Map(),
};

const crowdsaleCreateStart = (state,action) => {
    return { 
        ...state, 
        loading: true,
        crowdSaleCreated: false,
        crowdSaleUnlocked: false,
        error: null,
    };
}

const crowdsaleCreateReset = (state,action) =>{
    return {
        ...state, 
        loading: false, 
        crowdSaleCreated: false 
    }
}

const crowdsaleCreateFail = (state, action) => {
    return {
        ...state, 
        loading: false, 
        crowdSaleCreated:false, 
        error: action.error
    }
}

const crowdsaleCreateSuccess = (state, action) => {
    return {
        ...state, 
        loading: false, 
        crowdSaleCreated: true,
    }
}

const crowdsaleUnlockSuccess = (state, action) => {
    return {
        ...state,
        crowdSaleUnlocked: true,
    }
}

const crowdsaleUnlockFail = (state, action) => {
    return {
        ...state,
        crowdSaleUnlocked: false,
    }
}

const crowdsaleGetAllReset = (state, action) => {
    return {
        ...state,
        loading: false,
        crowdsales: []
    }
};

const crowdasleGetAllStart = (state, action) => {
    return{
        ...state,
        loading: true,
    }
};

const crowdsaleGetAllSuccess = (state, action) => {
    return{
        ...state,
        loading: false,
        crowdsales: action.crowdsalesArray
    }
};

const crowdsaleGetAllFail = (state, action) => {
    return {
        ...state,
        loading: false,
        error: action.error,
        crowdsales: []
    }
};

const crowdsaleGetParticipantCoinBalanceStart = (state, action) => {
    return {
        ...state,
        participantCoinToJoinBalance: 0,
        participantCoinToJoinLoaded: false,
    };
};

const crowdsaleGetParticipantCoinBalanceDone = (state, action) => {
    return {
        ...state,
        participantCoinToJoinBalance: action.balance,
        participantCoinToJoinLoaded: true,
    }
};

const crowdsaleGetParticipantReservationStart = (state, action) => {
    return {
        ...state,
        participantReservationValue: 0,
        participantReservationLoaded: false,
    };
};

const crowdsaleGetParticipantReservationDone = (state, action) => {
    return {
        ...state,
        participantReservationValue: action.reservationValue,
        participantReservationLoaded: true,
    };
};


const crowdsaleApprovalStarted = (state, action) => {
    return{
        ...state,
        approvalPending: true,
    };
};

const crowdsaleApprovalDone = (state, action) => {
    return{
        ...state,
        approvalPending: false,
    };
};

const crowdsaleJoinReset = (state, action) => {
    return {
        ...state,
        joined: undefined,
        pledgePending: true,
        approvalPending: false,
    }
};

const crowdsaleJoinDone = (state, action) => {
    return{
        ...state,
        joined: action.joinedSuccessfully,
        pledgePending: false,
    }
};

const crowdsaleRefundReset = (state, action) => {
    return {
        ...state,
        refunded: undefined,
        pledgePending: true,
        approvalPending: false,
    }
};

const crowdsaleRefundDone = (state, action) => {
    return{
        ...state,
        refunded: action.refundedSuccessfully,
        pledgePending: false,
    }
};




const crowdsaleGetStateReset = (state, action) => {
    return{
        ...state,
        crowdsaleStatus: undefined,
    }
};

const crowdsaleGetStateDone = (state, action) => {
    return{
        ...state,
        crowdsaleStatus: action.status,
    }
};

const crowdsaleGetCompleteReservationsReset = (state, action) =>{
    return{
        ...state,
        totalReservation: undefined,
    }
};

const crowdsaleGetCompleteReservationsDone = (state, action) => {
    return{
        ...state,
        totalReservation: action.totalReservations,
    }
};

const crowdsaleAddIcon = (state, action) => {
    const newIconsCache = new Map(state.iconsCache);
    newIconsCache.set(action.photoHash, action.icon);
    return {
        ...state,
        iconsCache: newIconsCache,
    }
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.CROWDSALE_CREATE_START: return crowdsaleCreateStart(state,action);
        case actionTypes.CROWDSALE_CREATE_FAIL: return crowdsaleCreateFail(state,action);
        case actionTypes.CROWDSALE_CREATE_RESET: return crowdsaleCreateReset(state,action);
        case actionTypes.CROWDSALE_CREATE_SUCCESS: return crowdsaleCreateSuccess(state,action);

        case actionTypes.CROWDSALE_UNLOCK_SUCCESS: return crowdsaleUnlockSuccess(state, action);
        case actionTypes.CROWDSALE_UNLOCK_FAIL: return crowdsaleUnlockFail(state, action);

        case actionTypes.CROWDSALE_GET_ALL_FAIL: return crowdsaleGetAllFail(state, action);
        case actionTypes.CROWDSALE_GET_ALL_RESET: return crowdsaleGetAllReset(state, action);
        case actionTypes.CROWDSALE_GET_ALL_SUCCESS: return crowdsaleGetAllSuccess(state,action);
        case actionTypes.CROWDSALE_GET_ALL_START: return crowdasleGetAllStart(state,action);

        case actionTypes.CROWDSALE_GET_PARTICIPANT_COIN_BALANCE_START: return crowdsaleGetParticipantCoinBalanceStart(state, action);
        case actionTypes.CROWDSALE_GET_PARTICIPANT_COIN_BALANCE_DONE: return crowdsaleGetParticipantCoinBalanceDone(state, action);

        case actionTypes.CROWDSALE_GET_PARTICIPANT_RESERVATION_START: return crowdsaleGetParticipantReservationStart(state, action);
        case actionTypes.CROWDSALE_GET_PARTICIPANT_RESERVATION_DONE: return crowdsaleGetParticipantReservationDone(state, action);

        case actionTypes.CROWDSALE_PLEDGE_APPROVAL_STARTED: return crowdsaleApprovalStarted(state, action);
        case actionTypes.CROWDSALE_PLEDGE_APPROVAL_DONE: return crowdsaleApprovalDone(state, action);
        case actionTypes.CROWDSALE_REFUND_RESET: return crowdsaleRefundReset(state, action);
        case actionTypes.CROWDSALE_REFUND_DONE: return crowdsaleRefundDone(state, action);
        case actionTypes.CROWDSALE_JOIN_RESET: return crowdsaleJoinReset(state, action);
        case actionTypes.CROWDSALE_JOIN_DONE: return crowdsaleJoinDone(state, action);

        case actionTypes.CROWDSALE_GET_STATUS_RESET: return crowdsaleGetStateReset(state, action);
        case actionTypes.CROWDSALE_GET_STATUS_DONE: return crowdsaleGetStateDone(state, action);

        case actionTypes.CROWDSALE_GET_COMPLETE_RESERVATION_RESET: return crowdsaleGetCompleteReservationsReset(state,action);
        case actionTypes.CROWDSALE_GET_COMPLETE_RESERVATION_DONE: return crowdsaleGetCompleteReservationsDone(state,action);
        
        case actionTypes.CROWDSALE_ADD_ICON: return crowdsaleAddIcon(state, action);
        default: return state;
    }
};

export default reducer;