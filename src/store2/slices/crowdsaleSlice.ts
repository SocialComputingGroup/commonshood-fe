import {createSlice, Dispatch, PayloadAction} from '@reduxjs/toolkit';
import {logger} from "../../utilities/winstonLogging/winstonInit";
import {assetDecimalRepresentationToInteger} from "../../utilities/decimalsHandler/decimalsHandler";
import config from "../../config";
import {uploadResource} from "../../api/resourceApi";
import {createCrowdsale} from "../../api/crowdsaleAPI";

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
        crowdsaleCreateStart(state) {
            state.loading = true;
            state.crowdSaleCreated = false;
            state.crowdSaleUnlocked = false;
            state.error = null;
        },

        crowdsaleCreateReset(state) {
            state.loading = false;
            state.crowdSaleCreated = false;
        },

        crowdsaleCreateFail(state, action: PayloadAction<{ error: string }>) { //TODO fixme
            state.loading = false;
            state.crowdSaleCreated = false;
            state.error = action.payload.error;
        },

        crowdsaleCreateSuccess(state) {
            state.loading = false;
            state.crowdSaleCreated = true;
        },

        crowdsaleUnlockSuccess(state) {
            state.crowdSaleUnlocked = true;
        },

        crowdsaleUnlockFail(state) {
            state.crowdSaleUnlocked = false;
        },

        crowdsaleGetAllReset(state) {
            state.loading = false;
            state.crowdsales = [];
        },

        crowdasleGetAllStart(state) {
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

        crowdsaleGetParticipantCoinBalanceStart(state) {
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

        crowdsaleApprovalStarted(state) {
            state.approvalPending = true;
        },

        crowdsaleApprovalDone(state) {
            state.approvalPending = false;
        },

        crowdsaleJoinReset(state) {
            state.joined = undefined;
            state.pledgePending = true;
            state.approvalPending = false;

        },

        crowdsaleJoinDone(state, action: PayloadAction<{ joinedSuccessfully: any }>) { //TODO fixme
            state.joined = action.payload.joinedSuccessfully;
            state.pledgePending = false;
        },

        crowdsaleRefundReset(state) {
            state.refunded = undefined;
            state.pledgePending = true;
            state.approvalPending = false;
        },

        crowdsaleRefundDone(state, action: PayloadAction<{ refundedSuccessfully: any }>) { //TODO fixme
            state.refunded = action.payload.refundedSuccessfully;
            state.pledgePending = false;
        },
        crowdsaleGetStateReset(state) {
            state.crowdsaleStatus = undefined;
        },

        crowdsaleGetStateDone(state, action: PayloadAction<{ status: any }>) { //TODO fixme
            state.crowdsaleStatus = action.payload.status;
        },

        crowdsaleGetCompleteReservationsReset(state) {
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

export const {
    crowdsaleCreateStart, crowdsaleCreateReset, crowdsaleCreateFail, crowdsaleCreateSuccess,
    crowdsaleUnlockFail, crowdsaleUnlockSuccess, crowdsaleGetAllReset, crowdasleGetAllStart,
    crowdsaleGetAllSuccess, crowdsaleGetAllFail, crowdsaleGetParticipantReservationStart,
    crowdsaleGetCompleteReservationsDone, crowdsaleGetParticipantCoinBalanceStart,
    crowdsaleGetParticipantCoinBalanceDone, crowdsaleApprovalStarted, crowdsaleApprovalDone,
    crowdsaleJoinDone, crowdsaleJoinReset, crowdsaleRefundDone, crowdsaleRefundReset,
    crowdsaleGetStateDone, crowdsaleGetStateReset, crowdsaleGetCompleteReservationsReset,
    crowdsaleGetParticipantReservationDone, crowdsaleAddIcon
} = crowdsaleSlice.actions;

export type CrowdsaleData = {
    contractFile: File,
    iconFile: File,
    emittedCoin: any,
    acceptedCoin: any,
    startDate: Date,
    endDate: Date,
    bigTitle: string,
    details: string,
    acceptedCoinRatio: number,
    forEachEmittedCoin: number,
    totalAcceptedCoin: number
};

export const crowdsaleCreate = (crowdsaleData: CrowdsaleData) => {
    logger.info('[CROWDSALE CREATE] called', crowdsaleData);

    return async (dispatch: Dispatch, getState: () => any) => { //TODO fixme, here getState should return the ROOT state from store.ts
        dispatch(crowdsaleCreateStart());

        let contractHash, iconHash;
        try {
            const contractResponse = await uploadResource(crowdsaleData.contractFile);
            contractHash = contractResponse.fileHash;
            const iconResponse = await uploadResource(crowdsaleData.iconFile);
            iconHash = iconResponse.fileHash;

            const web3 = getState().web3.web3Instance;
            try {
                const accountAddress = getState().web3.currentAccount;
                const creationResponse = await createCrowdsale(web3, accountAddress,
                    {
                        tokenToGiveAddr: crowdsaleData.emittedCoin.address,
                        tokenToAccept: crowdsaleData.acceptedCoin.address,
                        start: Math.floor(new Date(crowdsaleData.startDate).getTime() / 1000),
                        end: Math.floor(new Date(crowdsaleData.endDate).getTime() / 1000),
                        acceptRatio: parseInt(assetDecimalRepresentationToInteger(crowdsaleData.acceptedCoinRatio, crowdsaleData.acceptedCoin.decimals)),
                        giveRatio: parseInt(assetDecimalRepresentationToInteger(crowdsaleData.forEachEmittedCoin, crowdsaleData.emittedCoin.decimals)),
                        maxCap: parseInt(assetDecimalRepresentationToInteger(crowdsaleData.totalAcceptedCoin, crowdsaleData.acceptedCoin.decimals)),
                        metadata: [
                            crowdsaleData.bigTitle,
                            crowdsaleData.details,
                            iconHash,
                            contractHash,
                        ]
                    });
                logger.info('metamask succesfully created res: ', creationResponse);
                dispatch(crowdsaleCreateSuccess());
            } catch (error) {
                console.log("ERROR: ", error);
                dispatch(crowdsaleCreateFail(error));
            }
        } catch (error) {
            console.log("ERROR: ", error);
            dispatch(crowdsaleCreateFail(error));
        }
    }
};

export default crowdsaleSlice.reducer;