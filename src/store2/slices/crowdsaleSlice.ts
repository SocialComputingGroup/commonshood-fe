import {createSlice, Dispatch, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '../store';
import {logger} from "../../utilities/winstonLogging/winstonInit";
import {
    assetDecimalRepresentationToInteger,
    assetIntegerToDecimalRepresentation
} from "../../utilities/decimalsHandler/decimalsHandler";
import {
    getImg, getTOSFile,
    uploadResource
} from "../../api/resourceAPI";
import {
    approveTransfer,
    createCrowdsale, crowdsaleGetReservationsOfAccount,
    getAcceptRatioRaw,
    getAllCrowdsales, getCap,
    getCrowdsaleWalletBalanceOfTokenToGive, getDescription,
    getEndDateRaw,
    getGiveRatioRaw, getLogoHash,
    getOwner,
    getStartDateRaw, getStatus,
    getTitle, getTokenToAcceptAddr,
    getTokenToGiveAddr, getTOSHash, getTotalReservations,
    joinCrowdsale,
    refundFromCrowdsale,
    unlockCrowdsale
} from "../../api/crowdsaleAPI";
import config from "../../config";
import {CoinBalance, coinGetBalance, coinGetFullData} from "../../api/coinAPI";
import {crowdsaleAddIconToCache, crowdsaleGetAllStart} from "../../store/actions/crowdsale";

type CrowdsaleInitialState = {
    error: string | null,
    loading: boolean,
    crowdSaleCreated: boolean,
    crowdSaleUnlocked: boolean,
    crowdsales: any[], //TODO crowdsale type needed
    participantCoinToJoinBalance: CoinBalance, //TODO check that the 'number' type is correct
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
    participantCoinToJoinBalance: {balance: 0, decimals: 0},
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
            state.participantCoinToJoinBalance = {balance: 0, decimals: 0};
            state.participantCoinToJoinLoaded = false;
        },

        crowdsaleGetParticipantCoinBalanceDone(state, action: PayloadAction<{ balance: CoinBalance }>) {
            state.participantCoinToJoinBalance = action.payload.balance;
            state.participantCoinToJoinLoaded = true;
        },

        crowdsaleGetParticipantReservationStart(state) {
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

        crowdsaleRefundDone(state, action: PayloadAction<{ refundedSuccessfully: number }>) { //TODO fixme
            state.refunded = action.payload.refundedSuccessfully;
            state.pledgePending = false;
        },
        crowdsaleGetStateReset(state) {
            state.crowdsaleStatus = undefined;
        },

        crowdsaleGetStateFail(state, action: PayloadAction<{ error: any }>) { //TODO fixme
            state.error = action.payload.error;
        },

        crowdsaleGetStateDone(state, action: PayloadAction<{ status: number }>) {
            state.crowdsaleStatus = action.payload.status;
        },

        crowdsaleGetCompleteReservationsReset(state) {
            state.totalReservation = undefined;
        },

        crowdsaleGetCompleteReservationsDone(state, action: PayloadAction<{ totalReservations: number }>) { //TODO fixme
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
    crowdsaleGetParticipantReservationDone, crowdsaleAddIcon, crowdsaleGetStateFail
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

    return async (dispatch: Dispatch, getState: () => RootState) => { //TODO fixme, here getState should return the ROOT state from store.ts
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


export const crowdsaleGetAll = () => {
    logger.info('[IN CROWDSALEGETALL action]');
    return async (dispatch: Dispatch, getState: () => RootState) => {
        dispatch(crowdsaleGetAllReset());
        dispatch(crowdsaleGetAllStart());

        const crowdsaleStatusEnum = config.crowdsaleStatus;
        const web3 = getState().web3.web3Instance;
        try {
            const accountAddress = getState().web3.currentAccount;
            let crowdsaleAddresses = [];
            crowdsaleAddresses = await getAllCrowdsales(web3, accountAddress);
            logger.debug("got crowdsale addresses: ", crowdsaleAddresses);

            if (crowdsaleAddresses == null || crowdsaleAddresses.length === 0) { //no crowdsales found
                dispatch(crowdsaleGetAllSuccess({crowdsalesArray: crowdsaleAddresses}));
                return;
            }
            let crowdsalesExtendedData = await Promise.all(crowdsaleAddresses.map(async (crowdsaleAddress) => {
                //TODO see if its possible to directly return a struct from the contract instead of making all these calls!
                const ownerAddress = await getOwner(web3, accountAddress, crowdsaleAddress);
                const title = await getTitle(web3, accountAddress, crowdsaleAddress);
                const description = await getDescription(web3, accountAddress, crowdsaleAddress)
                const logoHash = await getLogoHash(web3, accountAddress, crowdsaleAddress)

                const TOSHash = await getTOSHash(web3, accountAddress, crowdsaleAddress)
                if (TOSHash === null) {
                    throw new Error(`TOShash is null`);
                }
                let TOS = null;
                const startDateRaw = await getStartDateRaw(web3, accountAddress, crowdsaleAddress);
                const endDateRaw = await getEndDateRaw(web3, accountAddress, crowdsaleAddress);
                const acceptRatioRaw = await getAcceptRatioRaw(web3, accountAddress, crowdsaleAddress);
                const giveRatioRaw = await getGiveRatioRaw(web3, accountAddress, crowdsaleAddress);

                const tokenToGiveAddr = await getTokenToGiveAddr(web3, accountAddress, crowdsaleAddress);
                const tokenToAcceptAddr = await getTokenToAcceptAddr(web3, accountAddress, crowdsaleAddress);
                if (tokenToGiveAddr === null || tokenToAcceptAddr === null) {
                    throw new Error(`problem getting tokenTogive: ${tokenToGiveAddr} - and/or tokenToAccept: ${tokenToAcceptAddr} addresses
                                    For crowdsale ${crowdsaleAddress}`);
                }
                const tokenToGive = await coinGetFullData(
                    getState().web3.web3Instance,
                    getState().web3.currentAccount,
                    tokenToGiveAddr
                );
                const tokenToAccept = await coinGetFullData(
                    getState().web3.web3Instance,
                    getState().web3.currentAccount,
                    tokenToAcceptAddr
                );

                const status = await getStatus(web3, accountAddress, crowdsaleAddress);
                const cap = await getCap(web3, accountAddress, crowdsaleAddress);
                const totalReservations = await getTotalReservations(web3, accountAddress, crowdsaleAddress);
                const tokenToGiveBalance = await getCrowdsaleWalletBalanceOfTokenToGive(web3, accountAddress, crowdsaleAddress, tokenToGiveAddr);

                if (startDateRaw === null || endDateRaw === null || status === null ||
                    acceptRatioRaw === null || cap === null || totalReservations === null || tokenToGiveBalance === null
                ) {
                    throw new Error(`Some data of crowdsale ${crowdsaleAddress} is null or empty`);
                }

                //getting files from webserver:
                // photo contains the hash, replace it with the image
                const crowdsaleIconCache = getState().crowdsale.iconsCache;
                let crowdsaleImage = null;

                if (logoHash === null) {
                    throw new Error(`logoHash is null, can't get crowdsale ${crowdsaleAddress} icon`);
                }

                if (crowdsaleIconCache.has(logoHash)) { //icon already in cache
                    logger.info(`icon for crowdsale ${title} in cache`);
                    crowdsaleImage = crowdsaleIconCache.get(logoHash);
                } else { //get icon from API
                    logger.info(`icon for crowdsale ${title} NOT in cache`);
                    const img = await getImg(logoHash);
                    //save in cache
                    dispatch(crowdsaleAddIconToCache(logoHash, img.data.file));
                    crowdsaleImage = img.data.file;
                }

                //TODO maybe start caching also the TOS file?
                const TOSraw = await getTOSFile(TOSHash);
                TOS = TOSraw.data.file;

                return {
                    crowdsaleAddress,
                    ownerAddress,
                    title,
                    description,
                    logoHash,
                    photo: crowdsaleImage,
                    TOS,
                    contractHash: TOSHash,
                    startDate: new Date(startDateRaw * 1000),
                    endDate: new Date(endDateRaw * 1000),
                    acceptRatio: parseFloat(assetIntegerToDecimalRepresentation(acceptRatioRaw, 2)), //accept ratio has always 2 decimals (coins)
                    giveRatio: giveRatioRaw, //giver ratio has always 0 decimals (coupons)
                    maxCap: parseFloat(assetIntegerToDecimalRepresentation(cap, 2)), //2 decimals (cap refers amount of coins)
                    tokenToAcceptAddr,
                    tokenToAccept,
                    tokenToGiveAddr,
                    tokenToGive,
                    status: crowdsaleStatusEnum[status], // TODO fix problem
                    totalReservations: parseFloat(assetIntegerToDecimalRepresentation(totalReservations, 2)),
                    tokenToGiveBalance,
                }
            }));

            logger.info("crowdsales extended data: ", crowdsalesExtendedData);
            dispatch(crowdsaleGetAllSuccess({crowdsalesArray: crowdsalesExtendedData}));
        } catch (error) {
            //TODO do something
            logger.debug("Error =>", error);
            const errorMessage = error?.message ?
                error.message :
                "ERROR -> Something went wrong while retriving crowdsales";
            dispatch(crowdsaleGetAllFail(errorMessage));
        }
    }
};


export const crowdsaleUnlock = (crowdsaleAddress: string) => {
    return (dispatch: Dispatch, getState: () => RootState) => {
        const web3 = getState().web3.web3Instance;
        try {
            const accountAddress = getState().web3.currentAccount;
            unlockCrowdsale(web3, accountAddress, crowdsaleAddress); //TODO check false return value?
            dispatch(crowdsaleUnlockSuccess());
        } catch (error) {
            logger.error('Crowdsale was not unlocked successfully');
            dispatch(crowdsaleUnlockFail());
        }
    }
};


export const crowdsaleGetParticipantCoinBalance = (coinAddress: string, coinDecimals: number) => {//coinTicker: any, coinDecimals: number) => {
    return async (dispatch: Dispatch, getState: () => RootState) => {
        dispatch(crowdsaleGetParticipantCoinBalanceStart());
        const web3 = getState().web3.web3Instance;
        try {
            const accountAddress = getState().web3.currentAccount;
            const balance = await coinGetBalance(web3, accountAddress, coinAddress);
            dispatch(crowdsaleGetParticipantCoinBalanceDone({balance}));
        } catch (error) {
            logger.error('the partecipant coin balance get was unsuccessful');
            dispatch(crowdsaleGetParticipantCoinBalanceDone(error));
        }
    }

};


export const crowdsaleGetParticipantReservation = (crowdsaleAddress: string, tokenAddress: string, acceptedCoinDecimals: number) => {
    //crowdsaleId: number, acceptedCoinDecimals: number) => {
    return async (dispatch: Dispatch, getState: () => RootState) => {
        dispatch(crowdsaleGetParticipantReservationStart());
        const web3 = getState().web3.web3Instance;
        try {
            const accountAddress = getState().web3.currentAccount;
            const reservations = await crowdsaleGetReservationsOfAccount(web3, accountAddress, crowdsaleAddress, tokenAddress);
            if (reservations === null) {
                throw new Error('CROWDSALE get partecipant reservation fail');
            }
            const value = Number(assetIntegerToDecimalRepresentation(reservations, acceptedCoinDecimals));
            dispatch(crowdsaleGetParticipantReservationDone({reservationValue: value}));
        } catch (error) {
            logger.error('CROWDSALE get partecipant reservation fail', error);
            dispatch(crowdsaleGetParticipantReservationDone({reservationValue: -1}));
        }
    }
};


export const crowdsaleJoin = (crowdsaleAddress: string, amount: number, decimals: number, tokenToAcceptAddress: string) => {
    return async (dispatch: Dispatch, getState: () => RootState) => {
        dispatch(crowdsaleJoinReset());
        const correctAmount = parseInt(assetDecimalRepresentationToInteger(amount, decimals));
        const web3Instance = getState().web3.web3Instance;
        const userWalletAddress = getState().web3.currentAccount;

        dispatch(crowdsaleApprovalStarted())
        const approveCompleted = await approveTransfer(web3Instance, userWalletAddress, crowdsaleAddress, tokenToAcceptAddress, correctAmount);
        dispatch(crowdsaleApprovalDone());
        if (!approveCompleted) {
            logger.error('CROWDSALE join fail');
            dispatch(crowdsaleJoinReset());
        } else {
            //we are now authorized to join
            const joinCompleted = await joinCrowdsale(web3Instance, userWalletAddress, crowdsaleAddress, correctAmount);
            if (joinCompleted) {
                logger.debug('CROWDSALE getStatus success');
                dispatch(crowdsaleJoinDone({joinedSuccessfully: crowdsaleAddress}));
            } else {
                logger.error('CROWDSALE join fail');
                dispatch(crowdsaleJoinReset());
            }
        }
    }
};


export const crowdsaleRefund = (crowdsaleAddress: string, amount: number, decimals: number) => {
    return async (dispatch: Dispatch, getState: () => RootState) => {
        dispatch(crowdsaleRefundReset());
        const correctAmount = parseInt(assetDecimalRepresentationToInteger(amount, decimals));
        const web3Instance = getState().web3.web3Instance;
        const userWalletAddress = getState().web3.currentAccount;
        const refundCompleted = await refundFromCrowdsale(web3Instance, userWalletAddress, crowdsaleAddress, correctAmount);
        if (refundCompleted) {
            logger.debug('CROWDSALE refund success');
            dispatch(crowdsaleRefundDone({refundedSuccessfully: amount}));
        } else {
            logger.error('CROWDSALE refund fail');
            dispatch(crowdsaleRefundReset());
        }
    }
};


//NOTE: state is the state inside the blockchain not the "state" inside our instance in mongodb!!!
export const crowdsaleGetStatus = (crowdsaleAddress: string) => {//(crowdsaleId: number) => {
    return async (dispatch: Dispatch, getState: () => RootState) => {
        dispatch(crowdsaleGetStateReset());
        const web3 = getState().web3.web3Instance;
        try {
            const accountAddress = getState().web3.currentAccount;
            const status = await getStatus(web3, accountAddress, crowdsaleAddress);
            if (status === null) {
                throw new Error('CROWDSALE getStatus fail');
            }
            logger.debug('CROWDSALE getStatus success');
            dispatch(crowdsaleGetStateDone({status}));
        } catch (error) {
            logger.error('CROWDSALE getStatus fail', error);
            dispatch(crowdsaleGetStateFail({error}));
        }
    }
};


export const crowdsaleGetCompleteReservations = (crowdsaleAddress: string) => {
    return async (dispatch: Dispatch, getState: () => RootState) => {
        dispatch(crowdsaleGetCompleteReservationsReset());
        const web3 = getState().web3.web3Instance;
        try {
            const accountAddress = getState().web3.currentAccount;
            const reservations = await getTotalReservations(web3, accountAddress, crowdsaleAddress);
            if (reservations === null) {
                throw new Error('CROWDSALE crowdsaleGetCompleteReservations fail')
            }
            logger.debug('CROWDSALE crowdsaleGetCompleteReservations success');
            dispatch(crowdsaleGetCompleteReservationsDone({totalReservations: reservations}));
        } catch (error) {
            logger.error('CROWDSALE crowdsaleGetCompleteReservations fail', error);
            dispatch(crowdsaleGetCompleteReservationsDone({totalReservations: -1}));
        }
    }
};

export default crowdsaleSlice.reducer;