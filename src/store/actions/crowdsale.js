import axios from '../../utilities/backend/axios-strongloop'
import axiosFl from '../../utilities/backend/axios-firstlife'
import {assetDecimalRepresentationToInteger, assetIntegerToDecimalRepresentation} from '../../utilities/decimalsHandler/decimalsHandler';
import {userAddCrowdsaleToWaitingTransactionConfirmation} from './user';
import config from '../../config';

import * as actionTypes from './actionTypes';

import {logger} from '../../utilities/winstonLogging/winstonInit';

export const crowdsaleCreateStart = () => {
    return {
        type: actionTypes.CROWDSALE_CREATE_START,
    }
};

export const crowdsaleCreateSuccess = () => {
    return {
        type: actionTypes.CROWDSALE_CREATE_SUCCESS,
    }
};

export const crowdsaleCreateFail = (error) => {
    return {
        type: actionTypes.CROWDSALE_CREATE_FAIL,
        error: error
    }
};

export const crowdsaleCreateReset = () => {
    return {
        type: actionTypes.CROWDSALE_CREATE_RESET, 
    }
};

export const crowdsaleUnlockSuccess = () =>{
    return {
        type: actionTypes.CROWDSALE_UNLOCK_SUCCESS,
    }
};

export const crowdsaleUnlockFail = (error) =>{
    return{
        type: actionTypes.CROWDSALE_UNLOCK_FAIL,
        error,
    }
};

export const crowdsaleGetAllReset = () =>{
    return{
        type: actionTypes.CROWDSALE_GET_ALL_RESET,
    }
};

export const crowdsaleGetAllStart = () =>{
    return{ 
        type: actionTypes.CROWDSALE_GET_ALL_START,
        loading: true,
    }
};

export const crowdsaleGetAllSuccess = (crowdsalesArray) =>{
    return{
        type: actionTypes.CROWDSALE_GET_ALL_SUCCESS,
        crowdsalesArray,
    }
};

export const crowdsaleGetAllFail = (error) =>{
    return {
        type: actionTypes.CROWDSALE_GET_ALL_FAIL,
        error,
    }
};

export const crowdsaleGetParticipantCoinBalanceStart = () => {
    return {
        type: actionTypes.CROWDSALE_GET_PARTICIPANT_COIN_BALANCE_START,
    };
};

export const crowdsaleGetParticipantCoinBalanceDone = (balance) => {
  return {
      type: actionTypes.CROWDSALE_GET_PARTICIPANT_COIN_BALANCE_DONE,
      balance,
  };
};


export const crowdsaleGetParticipantReservationStart = () => {
    return{
        type: actionTypes.CROWDSALE_GET_PARTICIPANT_RESERVATION_START
    };
};

export const crowdsaleGetParticipantReservationDone = (reservation) => {
    return{
        type: actionTypes.CROWDSALE_GET_PARTICIPANT_RESERVATION_DONE,
        reservationValue: reservation
    };
};

// export const crowdsaleJoinStarted = () => {
//     return {
//         type: actionTypes.CROWDSALE_JOIN_STARTED,
//     }
// };

export const crowdsaleJoinSuccess = () => {
    return {
        type: actionTypes.CROWDSALE_JOIN_DONE,
        joinedSuccessfully: true,
    }
};

export const crowdsaleJoinFail = () => {
    return {
        type: actionTypes.CROWDSALE_JOIN_DONE,
        joinedSuccessfully: false,
    }
};

export const crowdsaleRefundSuccess = () => {
    return{
        type: actionTypes.CROWDSALE_REFUND_DONE,
        refundedSuccessfully: true,
    }
};

export const crowdsaleRefundFail = ()=> {
    return{
        type: actionTypes.CROWDSALE_REFUND_DONE,
        refundedSuccessfully: false,
    }
};

export const crowdsaleJoinReset = () => {
    return {
        type: actionTypes.CROWDSALE_JOIN_RESET
    }
};

export const crowdsaleRefundReset = () => {
    return {
        type: actionTypes.CROWDSALE_REFUND_RESET
    }
};

export const crowdsaleGetStatusReset = () => {
    return{
        type: actionTypes.CROWDSALE_GET_STATUS_RESET,
    }
};

//blockchain states are 'running', 'stopped', 'locked'
//we add a 'fail' state passed from crowdsaleGetState in cases in which we cannot get it from the api call
export const crowdsaleGetStatusDone = (status) => {
    return{
        type: actionTypes.CROWDSALE_GET_STATUS_DONE,
        status
    }
};


export const crowdsaleGetCompleteReservationsReset = () =>{
    return{
        type: actionTypes.CROWDSALE_GET_COMPLETE_RESERVATION_RESET,
    }
};

export const crowdsaleGetCompleteReservationsDone = (reservations) =>{
    return{
        type: actionTypes.CROWDSALE_GET_COMPLETE_RESERVATION_DONE,
        totalReservations: reservations.totalReservations,
    }
};

export const crowdsaleAddIconToCache = (photoHash, icon) => {
    return {
        type: actionTypes.CROWDSALE_ADD_ICON,
        photoHash,
        icon
    }
};

//======================================================================================================================
// Async Actions

//FIXME this is only a temp function to generate mongoDB valid ids
const mongoObjectId = () => {
    let timestamp = (new Date().getTime() / 1000 | 0).toString(16);
    return timestamp + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, function() {
        return (Math.random() * 16 | 0).toString(16);
    }).toLowerCase();
};

const saveCrowdSaleData = (crowdsaleData, address, firsLifePointId, dispatch, getState) => {
        const configFileHeader = {
            headers: {
                'content-type': 'multipart/form-data',
                'Access-Control-Allow-Origin': '*'
            }
        };
        const {
            mainImage: imageFile,
            contract: contractFile
        } = crowdsaleData;
        //CONTRACT UPLOADING
        let imageHash = null, contractHash = null;
        let formData = new FormData();
        formData.append('file', contractFile);
        axios.post('/Resources/upload', formData, configFileHeader)
            .then( contractResponse =>{
                contractHash = contractResponse.data.file.hash;

                //IMAGE UPLOADING
                formData = new FormData();
                formData.append('file', imageFile);
                axios.post('/Resources/upload', formData, configFileHeader)
                .then(imageResponse => {
                    imageHash = imageResponse.data.file.hash;

                    //OK if we are here we are ready to create the crowdsale
                    //remember dates must be converted in standard unix time before reaching the server

                    const currentProfile = getState().user.currentProfile;
                    const realm = currentProfile.realm;
                    let crowdsaleCreateURL = '';
                    if(realm === 'user'){
                        crowdsaleCreateURL = `/Crowdsales`;
                    }else if(realm === 'dao'){
                        //currentProfile.id is a firstlifeplaceid here
                        crowdsaleCreateURL = `DAOS/${currentProfile.id}/Crowdsale`;
                    }else{
                        throw new Error('You are not a user nor a dao, what are you? Realm: ' + realm);
                    }

                    //FIXME for crowdsales created by users the firstLifePlaceId is randomized
                    const firstLifePlaceID = realm === 'user' ? mongoObjectId() : currentProfile.id;

                    const gibberishValue = '123435';
                    const postData = {
                        firstLifePlaceID,
                        photo: imageHash,
                        contract: contractHash,
                        description: crowdsaleData.details,
                        title: crowdsaleData.bigTitle,
                        acceptedCoin: crowdsaleData.acceptedCoin.symbol,
                        acceptedCoinDecimals: crowdsaleData.acceptedCoin.decimals.toString(),
                        coinToGive: crowdsaleData.emittedCoin.symbol,
                        coinToGiveDecimals: crowdsaleData.emittedCoin.decimals.toString(),
                        startDate: Math.floor( new Date(crowdsaleData.startDate).getTime() / 1000 ).toString(),
                        endDate: Math.floor( new Date(crowdsaleData.endDate).getTime() / 1000).toString(),
                        acceptRatio: assetDecimalRepresentationToInteger(crowdsaleData.acceptedCoinRatio, crowdsaleData.acceptedCoin.decimals).toString(),
                        giveRatio: assetDecimalRepresentationToInteger(crowdsaleData.forEachEmittedCoin, crowdsaleData.emittedCoin.decimals).toString(),
                        maxCap: assetDecimalRepresentationToInteger(crowdsaleData.totalAcceptedCoin, crowdsaleData.acceptedCoin.decimals).toString(),
                        //unused
                        minCrowdfunding: gibberishValue,
                        maxCrowdfunding: gibberishValue,
                        minContribution: gibberishValue, 
                        baseUnit: gibberishValue,
                        firsLifePointId,
                        pointAddress: address
                    };

                    logger.debug('[In crowdsaleCreate, filtered POSTDATA] => ', postData);

                    axios.post(crowdsaleCreateURL, postData)
                        .then( crowdsaleCreationResponse => {
                            logger.debug('[in crowdsaleCreate after POST /Crowdsales] =>', crowdsaleCreationResponse);
                            dispatch(crowdsaleCreateSuccess());
                        })
                        .catch( error => { //catch error in POST crowdsale
                            logger.error('[error after POST /Crowdsales', error);
                            dispatch(crowdsaleCreateFail(error.response.data.error.message));
                        });
                })
                .catch(error => { //catch of uploading the image file
                    logger.error('[IN crowdsaleCreate action] image upload failed');
                    dispatch(crowdsaleCreateFail(error.response.data.error.message));
                });
            })
            .catch( error => { //catch of uploading the contract file
                logger.error('[IN crowdsaleCreate action] contract upload failed');
                dispatch(crowdsaleCreateFail(error.response.data.error.message));
            });

}

export const crowdsaleCreate = (crowdsaleData) => {
    logger.info('[CROWDSALE CREATE] called', crowdsaleData);

    return ( async (dispatch, getState) => {
        dispatch(crowdsaleCreateStart());
        const configFileHeader = {
            headers: {
                'content-type': 'multipart/form-data',
                'Access-Control-Allow-Origin': '*'
            }
        };

        let contractHash, imageHash;
        try {
            let formData = new FormData();
            formData.append('file', crowdsaleData.contract);
            const contractResponse = await axios.post('/Resources/upload', formData, configFileHeader);
            contractHash = contractResponse.data.file.hash;

            formData = new FormData();
            formData.append('file', crowdsaleData.mainImage);
            const imageResponse = await axios.post('/Resources/upload', formData, configFileHeader);
            imageHash = imageResponse.data.file.hash;
        }catch(error){
            dispatch(crowdsaleCreateFail("Something went wrong while loading image or TOS in backend"));
            return;
        }

        const data = {
            tokenToGiveAddr: crowdsaleData.emittedCoin.address,
            tokenToAccept: crowdsaleData.acceptedCoin.address,
            start: Math.floor( new Date(crowdsaleData.startDate).getTime() / 1000 ),
            end: Math.floor( new Date(crowdsaleData.endDate).getTime() / 1000),
            acceptRatio: parseInt(assetDecimalRepresentationToInteger(crowdsaleData.acceptedCoinRatio, crowdsaleData.acceptedCoin.decimals)),
            giveRatio: parseInt(assetDecimalRepresentationToInteger(crowdsaleData.forEachEmittedCoin, crowdsaleData.emittedCoin.decimals)),
            maxCap: parseInt(assetDecimalRepresentationToInteger(crowdsaleData.totalAcceptedCoin, crowdsaleData.acceptedCoin.decimals)),
            metadata: [
                crowdsaleData.bigTitle,
                crowdsaleData.details,
                imageHash,
                contractHash,
            ]
        }
        console.log("prepared data ", data);
        const web3 = getState().web3.web3Instance;
        try{
            const accountAddress = getState().web3.currentAccount;

                const crowdsaleFactoryInstance = new web3.eth.Contract(
                    config.smartContracts.CRWDSL_FCTRY_ABI,
                    config.smartContracts.CRWDSL_FCTRY_ADDR,
                );
                const creationResponse = await crowdsaleFactoryInstance.methods.createCrowdsale(
                    data.tokenToGiveAddr,
                    data.tokenToAccept,
                    data.start,
                    data.end,
                    data.acceptRatio,
                    data.giveRatio,
                    data.maxCap,
                    data.metadata,
                ).send({from: accountAddress, gasPrice: "0"});
                logger.info('metamask succesfully created res: ', creationResponse); 
                dispatch(crowdsaleCreateSuccess());
        }catch(error){
            console.log("ERROR: ", error);
            dispatch(crowdsaleCreateFail("something went wrong with metamask"));
        }

    });
    // return ( async (dispatch, getState) => {
    //     let geoLocationAddress;
    //     dispatch(crowdsaleCreateStart());
    //     if(crowdsaleData.locationSelectedId != null) { // the user gave this crowdsale an exact geolocation
    //         let data;
    //         try{
    //             const result = await fetch(`https://geocoder.ls.hereapi.com/6.2/geocode.json?apikey=VvXjx14bJOpsdA5WMO_PTLd5Hgia1wYAlb5vO7Oa8kk&locationid=${crowdsaleData.locationSelectedId}`);
    //             if(result.ok){
    //                 data = result.json();
    //             }else{
    //                 throw new Error("HERE api failure");
    //             }
            
    //             const locationData = data.Response.View[0].Result[0].Location;
    //             geoLocationAddress = locationData.Address.Label;
    //             const lat = locationData.DisplayPosition.Latitude;
    //             const lon = locationData.DisplayPosition.Longitude;

    //             const payload = {
    //                 type: "Feature",
    //                 properties: {
    //                     address: geoLocationAddress,
    //                     valid_from: "1900-12-4T09:01:30.516Z",
    //                     user: localStorage.getItem('member_id'),
    //                     name: crowdsaleData.bigTitle,
    //                     entity_type: "CC_CROWDFUNDING",
    //                     type: "CC_CROWDFUNDING",
    //                     domain_id: 35,
    //                     zoom_level: 18,
    //                     categories: []
    //                 },
    //                 geometry: {
    //                     type: "Point",
    //                     coordinates: [lon,lat]
    //                 }
    //             }
    //             const flCreateHeader = {
    //                 headers: {
    //                     'Authorization' : 'Bearer '+localStorage.getItem("token")
    //                 }
    //             };
            
    //             axiosFl.post('Things',payload, flCreateHeader).then(response => {
    //                 logger.info("[crowdsale.js - crowdsaleCreate]", response.data);
    //                 saveCrowdSaleData(
    //                     crowdsaleData, 
    //                     geoLocationAddress, 
    //                     response.data.id,
    //                     dispatch,
    //                     getState
    //                 );
    //             });
    //         }catch(error){
    //             dispatch(crowdsaleCreateFail(error));
    //         }
                    
    //     }
    //     else {
    //         saveCrowdSaleData(
    //             crowdsaleData, 
    //             geoLocationAddress,
    //             null,
    //             dispatch,
    //             getState
    //         );
    //     }
    // });
};


//returns all crowdsale in the db, whatever they are active or not
export const crowdsaleGetAll = () =>{
    logger.info('[IN CROWDSALEGETALL action]');
    return async (dispatch, getState) =>{
        dispatch(crowdsaleGetAllReset());
        dispatch(crowdsaleGetAllStart());

        const web3 = getState().web3.web3Instance;
        try{
            const accountAddress = getState().web3.currentAccount;
            const CrowdsaleFactoryInstance = new web3.eth.Contract(
                config.smartContracts.CRWDSL_FCTRY_ABI,
                config.smartContracts.CRWDSL_FCTRY_ADDR,
            );
            let crowdsaleAddresses = [];
            crowdsaleAddresses = await CrowdsaleFactoryInstance.methods.getAllCrowdsalesAddresses()
                .call({from: accountAddress, gasPrice: "0"});
            console.log("CWD ADDR", crowdsaleAddresses);

            let crowdsalesExtendedData = crowdsaleAddresses.map( (crowdsaleAddress) => {
                return CrowdsaleFactoryInstance.methods.getCrowdSale(
                        crowdsaleAddress
                    ).call({from: accountAddress, gasPrice: "0"});
            });
            crowdsalesExtendedData = await Promise.all(crowdsalesExtendedData);

            console.log(crowdsalesExtendedData);
        }catch(error){
            //TODO do something
            logger.debug("Error");
        }

        // let response = await axios.get(
        //     '/Crowdsales', 
        //     { 
        //         params: {
        //             filter: 
        //                 {
        //                     where: {state: "confirmed" } //get only crowdsales already in blockchain and not still pending
        //                 },
        //         }
        //     }
        // );
        // logger.debug('[CROWDSALEGETALL response] ', response);
        // let crowdsales = response.data;
        // if(crowdsales.length === 0){
        //     //no crowdsales found
        //     dispatch(crowdsaleGetAllSuccess([]));
        // }else{
        //     //now we have to get the image of each crowdsale
        //     const crowdsaleIconCache = getState().crowdsale.iconsCache;
        //     let url = '/Resources/get/';
        //     const params = {};

        //     try{
        //         crowdsales.forEach( async (crowdsale) =>{
        //             //converting maxCap, acceptRatio and giveRatio based on decimals of related coins
        //             crowdsale.maxCap = assetIntegerToDecimalRepresentation(crowdsale.maxCap, crowdsale.acceptedCoinDecimals);
        //             crowdsale.acceptRatio = assetIntegerToDecimalRepresentation(crowdsale.acceptRatio, crowdsale.acceptedCoinDecimals);
        //             crowdsale.giveRatio = assetIntegerToDecimalRepresentation(crowdsale.giveRatio, crowdsale.coinToGiveDecimals);
                    
        //             //photo contains the hash, replace it with the image
        //             if(crowdsaleIconCache.has(crowdsale.photo)){ //icon already in cache
        //                 logger.info(`icon for crowdsale ${crowdsale.title} in cache`);
        //                 crowdsale.photo = crowdsaleIconCache.get(crowdsale.photo)
        //             }else{ //get icon from API
        //                 logger.info(`icon for crowdsale ${crowdsale.title} NOT in cache`);
        //                 const img = await axios.get(url+crowdsale.photo, params);
        //                 //save in cache
        //                 dispatch(crowdsaleAddIconToCache(crowdsale.photo, img.data));
        //                 crowdsale.photo = img.data;
        //             }

        //             let promises = [];
        //             crowdsales.forEach((crowdsale) => {
        //                 //photo contains the hash
        //                 promises.push(axios.get(`/Crowdsales/${crowdsale.crowdsaleID}/getReservations`, params));
        //             });

        //             Promise.all(promises).then((resultReservations) => {
        //                 crowdsales.forEach( (crowdsale, index) => {
        //                     crowdsale.totalReservations = assetIntegerToDecimalRepresentation(resultReservations[index].data.totalReservations, crowdsale.acceptedCoinDecimals);
        //                 });
        //                 logger.info('[CROWDSALEGETALL after get reservations]', crowdsales);
        //                 dispatch(crowdsaleGetAllSuccess(crowdsales));
        //             });
                    
        //         });
        //     }catch(error){
        //         logger.error('[CROWDSALEGETALL error] ', error);
        //         dispatch(crowdsaleGetAllFail(error));
        //     }
        // }
    }
};



export const crowdsaleUnlock = (crowdsaleID) =>{
    return (dispatch) => {
        axios.post(`/Crowdsales/${crowdsaleID}/unlock`)
            .then( (response) => {
                logger.debug('CROWDSALE CORRECTLY UNLOCKED', response);
                dispatch(crowdsaleUnlockSuccess());
            })
            .catch( (error) => {
                logger.error('CROWDSALE UNLOCK FAILURE', error);
                dispatch(crowdsaleUnlockFail(error));
            });
    }

};


export const crowdsaleGetParticipantCoinBalance = (coinTicker, coinDecimals) => {
    return (dispatch, getState) => {
        dispatch(crowdsaleGetParticipantCoinBalanceStart());

        const currentProfile = getState().user.currentProfile;
        const realm = currentProfile.realm;

        let getBalanceOfCoinURL = '';
        if(realm === 'user'){
            getBalanceOfCoinURL = `Coins/${coinTicker}/MyBalance`;
        }else if(realm === 'dao'){
            //currentProfile.id is a firstlifeplaceid here
            getBalanceOfCoinURL = `DAOS/${currentProfile.id}/balance/${coinTicker}`;
        }else{
            throw new Error('You are not a user nor a dao, what are you? Realm: ' + realm);
        }

        return axios.get(getBalanceOfCoinURL)
            .then( (response) => {
                logger.debug('[IN CrowdsaleGetCoinBalanceOfProfile] response: ', response);
                dispatch(crowdsaleGetParticipantCoinBalanceDone(
                    assetIntegerToDecimalRepresentation(response.data.amount, coinDecimals)
                ));
            })
            .catch( (error) => {
                logger.error('[IN CrowdsaleGetCoinBalanceOfProfile] error: ', error);
                dispatch(crowdsaleGetParticipantCoinBalanceDone(0));
            });
    }
};



export const crowdsaleGetParticipantReservation = (crowdsaleId, acceptedCoinDecimals) => {
    return (dispatch, getState) => {
        dispatch(crowdsaleGetParticipantReservationStart());
        const url = `/Crowdsales/${crowdsaleId}/getMyReservation`;

        return axios.get(url)
            .then( (response) => {
                logger.debug('[IN crowdsaleGetParticipantReservation] response => ', response);
                dispatch(crowdsaleGetParticipantReservationDone(
                    assetIntegerToDecimalRepresentation(response.data.reservation, acceptedCoinDecimals)
                ));
            })
            .catch( error => {
                logger.error('[IN crowdsaleGetParticipantReservation] error => ', error);
                dispatch(crowdsaleGetParticipantReservationDone(-1)); //negative value indicates we had some problem
            });
    }
};



export const crowdsaleJoin = (crowdsaleId, amount, acceptedCoinDecimals) => {
    return (dispatch) => {
        dispatch(crowdsaleJoinReset());

        const url = `/Crowdsales/${crowdsaleId}/join/${assetDecimalRepresentationToInteger(amount, acceptedCoinDecimals)}`;

        return axios.post(url)
            .then( (response) => {
                logger.debug('[CROWDSALE JOIN] success', response);
                dispatch(crowdsaleJoinSuccess());
                //add this transaction to those waiting for confirmation in profile list
                dispatch(userAddCrowdsaleToWaitingTransactionConfirmation(crowdsaleId));
            })
            .catch( (error) =>{
                logger.error('[CROWDSALE JOIN] failure', error);
                dispatch(crowdsaleJoinFail());
            })
    }

};

export const crowdsaleRefund = (crowdsaleId, amount, acceptedCoinDecimals) => {
    return (dispatch) => {
        dispatch(crowdsaleRefundReset());

        const url = `/Crowdsales/${crowdsaleId}/refund_me/${assetDecimalRepresentationToInteger(amount, acceptedCoinDecimals)}`;

        return axios.post(url)
            .then( (response) => {
                logger.debug('[CROWDSALE REFUND] success', response);
                dispatch(crowdsaleRefundSuccess())
            })
            .catch( (error) =>{
                logger.error('[CROWDSALE REFUND] failure', error);
                dispatch(crowdsaleRefundFail());
            })
    }
};


//NOTE: state is the state inside the blockchain not the "state" inside our instance in mongodb!!!
export const crowdsaleGetStatus = (crowdsaleId) => {
    return (dispatch) => {
        dispatch(crowdsaleGetStatusReset());

        const url = `/Crowdsales/${crowdsaleId}/getStatus`;
        return axios.get(url)
            .then( (response) => {
                logger.debug('CROWDSALE getStatus success', response);
                dispatch(crowdsaleGetStatusDone(response.data.status));
            })
            .catch( (error) => {
                logger.error('CROWDSALE getStatus fail', error);
                dispatch(crowdsaleGetStatusDone('failed'));
            });
    }
};



export const crowdsaleGetCompleteReservations = (crowdsaleId, acceptedCoinDecimals) => {
    return (dispatch) => {
        dispatch(crowdsaleGetCompleteReservationsReset());

        const url = `/Crowdsales/${crowdsaleId}/getReservations`;
        return axios.get(url)
            .then( (response) => {
                logger.debug('CROWDSALE crowdsaleGetCompleteReservations success', response);
                dispatch(crowdsaleGetCompleteReservationsDone({
                    totalReservations: assetIntegerToDecimalRepresentation(response.data.totalReservations, acceptedCoinDecimals)
                }));
            })
            .catch( (error) => {
                logger.error('CROWDSALE crowdsaleGetCompleteReservations fail', error);
                dispatch(crowdsaleGetCompleteReservationsDone({
                    totalReservations: -1
                }));
            });
    }
};