import {createSlice, PayloadAction} from '@reduxjs/toolkit';

type CrowdsaleInitialState = {
    error: string | null,
    loading: boolean,
    crowdSaleCreated: boolean,
    crowdSaleUnlocked: boolean,
    crowdsales: any[], //TODO crowdsale type needed
    participantCoinToJoinBalance: number, //TODO check that the 'number' type is correct
    participantCoinToJoinLoaded: boolean,
    participantReservationValue: number, //TODO check that the 'number' type is correct
    participantReservationLoaded: boolean,
    approvalPending: boolean,
    pledgePending: boolean,
    joined: any | undefined,//TODO fix this
    refunded: any | undefined, //TODO fix this
    crowdsaleStatus: any | undefined,//TODO fix this
    partialReservation: any | undefined, //TODO fix this
    totalReservation: any | undefined, //TODO fix this
    iconsCache: Map<any, any>,//TODO fix this
};

const initialState: CrowdsaleInitialState = {
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

export const crowdsaleSlice = createSlice({
    name: 'crowdsale',
    initialState,
    reducers: {
        crowdsaleCreateStart(state, action) {
            state.loading = true;
            state.crowdSaleCreated = false;
            state.crowdSaleUnlocked = false;
            state.error = null;
        },

        crowdsaleCreateReset(state, action) {
            state.loading = false;
            state.crowdSaleCreated = false;
        },

        crowdsaleCreateFail(state, action: PayloadAction<{ error: any }>) { //TODO fixme
            state.loading = false;
            state.crowdSaleCreated = false;
            state.error = action.payload.error;
        },

        crowdsaleCreateSuccess(state, action) {
            state.loading = false;
            state.crowdSaleCreated = true;
        },

        crowdsaleUnlockSuccess(state, action) {
            state.crowdSaleUnlocked = true;
        },

        crowdsaleUnlockFail(state, action) {
            state.crowdSaleUnlocked = false;
        },

        crowdsaleGetAllReset(state, action) {
            state.loading = false;
            state.crowdsales = [];
        },

        crowdasleGetAllStart(state, action) {
            state.loading = true;
        },

        crowdsaleGetAllSuccess(state, action: PayloadAction<{ crowdsalesArray: any[] }>) { //TODO fixme
            state.loading = false;
            state.crowdsales = action.payload.crowdsalesArray;
        },

        crowdsaleGetAllFail(state, action: PayloadAction<{ error: any }>) { //TODO fixme
            state.loading = false;
            state.error = action.payload.error;
            state.crowdsales = [];
        },

        crowdsaleGetParticipantCoinBalanceStart(state, action) {
            state.participantCoinToJoinBalance = 0;
            state.participantCoinToJoinLoaded = false;
        },

        crowdsaleGetParticipantCoinBalanceDone(state, action: PayloadAction<{ balance: number }>) {  //TODO fixme
            state.participantCoinToJoinBalance = action.payload.balance;
            state.participantCoinToJoinLoaded = true;
        },

        crowdsaleGetParticipantReservationStart(state, action) {
            state.participantReservationValue = 0;
            state.participantReservationLoaded = false;
        },

        crowdsaleGetParticipantReservationDone(state, action: PayloadAction<{ reservationValue: number }>) {  //TODO fixme
            state.participantReservationValue = action.payload.reservationValue;
            state.participantReservationLoaded = true;
        },

        crowdsaleApprovalStarted(state, action) {
            state.approvalPending = true;
        },

        crowdsaleApprovalDone(state, action) {
            state.approvalPending = false;
        },

        crowdsaleJoinReset(state, action) {
            state.joined = undefined;
            state.pledgePending = true;
            state.approvalPending = false;

        },

        crowdsaleJoinDone(state, action: PayloadAction<{ joinedSuccessfully: any }>) { //TODO fixme
            state.joined = action.payload.joinedSuccessfully;
            state.pledgePending = false;
        },

        crowdsaleRefundReset(state, action) {
            state.refunded = undefined;
            state.pledgePending = true;
            state.approvalPending = false;
        },

        crowdsaleRefundDone(state, action: PayloadAction<{ refundedSuccessfully: any }>) { //TODO fixme
            state.refunded = action.payload.refundedSuccessfully;
            state.pledgePending = false;
        },
        crowdsaleGetStateReset(state, action) {
            state.crowdsaleStatus = undefined;
        },

        crowdsaleGetStateDone(state, action: PayloadAction<{ status: any }>) { //TODO fixme
            state.crowdsaleStatus = action.payload.status;
        },

        crowdsaleGetCompleteReservationsReset(state, action) {
            state.totalReservation = undefined;
        },

        crowdsaleGetCompleteReservationsDone(state, action: PayloadAction<{ totalReservations: any }>) { //TODO fixme
            state.totalReservation = action.payload.totalReservations;
        },

        crowdsaleAddIcon(state, action: PayloadAction<{ photoHash: any, icon: any }>) { //TODO fixme
            const newIconsCache = new Map(state.iconsCache);
            newIconsCache.set(action.payload.photoHash, action.payload.icon);
            state.iconsCache = newIconsCache;
        },
    }
})

export const {} = crowdsaleSlice.actions;

export default crowdsaleSlice.reducer;