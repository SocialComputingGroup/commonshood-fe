import messageKeys from '../../utilities/notification/messageKeys';

//axios helper for loopback APIs
import axios from '../../utilities/backend/axios-strongloop'

import { logger } from '../../utilities/winstonLogging/winstonInit';

import config from "../../config"

// Import action types
import * as actionTypes from './actionTypes';
import { userSetCurrentProfile, userSetAllProfiles, userRemoveCrowdsaleFromWaitingTransactionConfirmation } from "./user";
import { coinGetListReset } from "./coin";
import { crowdsaleGetAll } from "./crowdsale";

// NOTIFICATION SOCKET =================================================================================================
export const notificationSocketAuthentication = (socket) => {
    return dispatch => {
        const token = localStorage.getItem('token');
        if (token) {
            dispatch(notificationSocketAuthenticationStart());
            logger.info('SOCKET Authentication STARTED');
            socket.on('authentication.start', (data) => {
                socket.emit('authentication', { Authentication: token });
                socket.on('authenticated', (resp) => {
                    if (resp.authentication === 'completed') {
                        dispatch(notificationSocketAuthenticationDone(null));
                    } else { //fail
                        dispatch(notificationSocketAuthenticationDone(resp.authentication))
                    }
                });
            });
        } else {
            dispatch(notificationSocketAuthenticationDone('No Valid Token'))
        }
    }
};

export const notificationSocketAuthenticationStart = () => {
    return {
        type: actionTypes.NOTIFICATION_SOCKET_AUTHENTICATION_START
    };
};

export const notificationSocketAuthenticationDone = (error) => {
    return {
        type: actionTypes.NOTIFICATION_SOCKET_AUTHENTICATION_DONE,
        error
    };
};

export const notificationSocketListening = () => {
    return {
        type: actionTypes.NOTIFICATION_SOCKET_LISTENING,
    };
};

export const notificationSocketNotListening = () => {
    return {
        type: actionTypes.NOTIFICATION_SOCKET_NOT_LISTENING,
    };
};

export const notificationSocketGotNewMessage = (msg) => {
    return {
        type: actionTypes.NOTIFICATION_SOCKET_GOT_NEW_MESSAGE,
        newNotification: msg
    };
};

export const notificationWeb3Listening = () => {
    return {
        type: actionTypes.NOTIFICATION_WEB3_LISTENING,
    };
};

export const notificationWeb3NotListening = () => {
    return {
        type: actionTypes.NOTIFICATION_WEB3_NOT_LISTENING,
    };
};

export const notificationWeb3GotNewMessage = (msg) => {
    return {
        type: actionTypes.NOTIFICATION_WEB3_GOT_NEW_MESSAGE,
        newNotification: msg
    };
};

export const notificationListenToBlockchain = (web3, currentAddress) => {
    return async (dispatch) => {
        const daoFactoryContractInstance = new web3.eth.Contract(
            config.smartContracts.DAO_FCTRY_ABI,
            config.smartContracts.DAO_FCTRY_ADDR,
        );

        const tokenFactoryContractInstance = new web3.eth.Contract(
            config.smartContracts.TKN_FCTRY_ABI,
            config.smartContracts.TKN_FCTRY_ADDR,
        );

        const crowdsaleFactoryContractInstance = new web3.eth.Contract(
            config.smartContracts.CRWDSL_FCTRY_ABI,
            config.smartContracts.CRWDSL_FCTRY_ADDR,
        );

        logger.debug("notificationListenToBlockchain");
        const tokenAddresses = await tokenFactoryContractInstance.methods.getPossessedTokens(currentAddress).call({ from: currentAddress });

        try {
            dispatch(notificationWeb3Listening());

            for (const address of tokenAddresses) {
                const tokenTemplateContractInstance = new web3.eth.Contract(
                    config.smartContracts.TKN_TMPLT_ABI,
                    address,
                );

                const symbol = await tokenTemplateContractInstance.methods.symbol().call({ from: currentAddress });
                const decimals = await tokenTemplateContractInstance.methods.decimals().call({ from: currentAddress });

                tokenTemplateContractInstance.events.Transfer({
                    filter: { _from: currentAddress },
                }, (error, event) => {
                    if (error) console.warn(error);
                    else {
                        console.log(event)
                        const notificationMessage = {
                            id: event.id,
                            type: "success",
                            body: {
                                message: {
                                    message_key: messageKeys.COIN_SENT,
                                    params: {
                                        ticker: symbol,
                                        decimals,
                                        sender: {
                                            fullname: currentAddress,
                                        },
                                        receiver: { // FIXME: we need to put name from some API here
                                            fullname: event.returnValues.to,
                                        },
                                        amount: event.returnValues.value,
                                    },
                                },
                            },
                        };
                        dispatch(notificationWeb3GotNewMessage(notificationMessage))
                    }
                });

                tokenTemplateContractInstance.events.Transfer({
                    filter: { _to: currentAddress },
                }, (error, event) => {
                    if (error) console.warn(error);
                    else {
                        const notificationMessage = {
                            id: event.id,
                            type: "success",
                            body: {
                                message: {
                                    message_key: messageKeys.COIN_RECEIVED,
                                    params: {
                                        ticker: symbol,
                                        decimals,
                                        receiver: { // FIXME: we need to put name from some API here
                                            fullname: event.returnValues.from,
                                        },
                                        sender: { // FIXME: we need to put name from some API here
                                            fullname: currentAddress,
                                        },
                                        amount: event.returnValues.value,
                                    },
                                },
                            },
                        };
                        dispatch(notificationWeb3GotNewMessage(notificationMessage))
                    }
                });

                tokenTemplateContractInstance.events.Mint({
                    filter: { _from: currentAddress },
                }, (error, event) => {
                    if (error) console.warn(error);
                    else {
                        const notificationMessage = {
                            id: event.id,
                            type: "success",
                            body: {
                                message: {
                                    message_key: messageKeys.COIN_MINTED,
                                    params: {
                                        ticker: symbol,
                                        decimals,
                                        amount: event.returnValues.value,
                                    },
                                },
                            },
                        };
                        dispatch(notificationWeb3GotNewMessage(notificationMessage))
                    }
                })
            }
        } catch {
            dispatch(notificationWeb3NotListening());
        }
    }
}

export const notificationListenToSocket = (socket) => {
    return (dispatch) => {

        dispatch(notificationSocketListening());
        logger.debug("notificationListenToSocket, socket =>", socket);
        try {
            socket.on('notification.new', (msg) => {
                logger.debug("notificationListenToSocket => got new message: ", msg);
                dispatch(notificationSocketGotNewMessage(msg));
            });
        } catch {
            dispatch(notificationSocketNotListening());
        }
    }
};

export const notificationRemoveFromCurrentlyListed = (messageId) => {
    logger.debug('[notification.js - notificationRemoveFromCurrentlyListed, id:', messageId);
    return {
        type: actionTypes.NOTIFICATION_REMOVE_FROM_CURRENTLY_LISTED,
        messageId: messageId,
    };
};

//NOTIFICATION MANAGER =================================================================================================
export const notificationManager = (notificationData) => {
    logger.debug('[notificationManager] managing notification', notificationData);
    const notificationMessage = notificationData.body.message;

    return (dispatch) => {
        switch (notificationMessage.message_key) {
            case messageKeys.COIN_RECEIVED:
            case messageKeys.DAO_COIN_RECEIVED:
                if (notificationData.type === 'success') {
                    dispatch(updateProfileCoinListAfterNotification(notificationMessage.params.receiver.id, notificationMessage.params.ticker));
                }
                break;
            case messageKeys.COIN_CREATED:
            case messageKeys.DAO_COIN_CREATED:
                if (notificationData.type === 'success') {
                    dispatch(updateProfileCoinListAfterNotification(notificationMessage.params.owner.id, notificationMessage.params.ticker));
                }
                break;
            case messageKeys.COIN_MINTED:
            case messageKeys.DAO_COIN_MINTED:
                logger.debug("COIN MINTED NOTIFICATION =>", notificationMessage);
                //dispatch(updateProfileCoinListAfterNotification(notificationMessage.params.minter, notificationMessage.params.ticker));
                if (notificationData.type === 'success') {
                    dispatch(updateCoinBalanceAfterNotification(notificationMessage.params.minter, notificationMessage.params.ticker, notificationMessage.params.amount));
                }
                break;
            case messageKeys.CROWDSALE_REFUNDED:
            case messageKeys.CROWDSALE_JOINED:
                dispatch(userRemoveCrowdsaleFromWaitingTransactionConfirmation(notificationMessage.params.crowdsaleId));
                if (notificationData.type === 'success') {
                    dispatch(crowdsaleGetAll());
                }
                break;
            default:
                logger.debug('no managing action yet implemented for notification: ', notificationMessage);
        }
    }

};


export const updateCoinBalanceAfterNotification = (ownerProfileId, ticker, amount) => {
    return (dispatch, getState) => {
        const currentProfile = getState().user.currentProfile;
        if (currentProfile.id === ownerProfileId) { //only if the current profile is the same related to the notification
            const coinList = getState().coin.coinList;
            const coinToUpdate = coinList.find((coin) => coin.symbol === ticker);
            if (coinToUpdate && (coinToUpdate.balance !== null)) { //only if the coin to update is present in the current coinlist
                //remember that the coinList in the user is based on which tab of the wallet he is looking RIGHT NOW
                dispatch(coinGetListReset());
            }
        }
    }
};

//using thunk here just because we need to access profile state
//this action just locally updates the coin list on the profile so we can load the balance
// of coins - never received/owned by the user - in the wallet asap
//the db coinlist is automatically updated once the user received the never-had-before coin
export const updateProfileCoinListAfterNotification = (ownerProfileId, ticker) => {
    return (dispatch, getState) => {
        let selectedProfile, currentCoinList;
        let selectedProfileIndex = 0;
        const profilesList = getState().user.profilesList;
        for (let i = 0; i < profilesList.length; i++) {
            let profile = profilesList[i];
            if (ownerProfileId === profile.id) {
                logger.debug('[updateProfileCoinListAfterNotification] got notification for ', profile);
                selectedProfile = profile;
                selectedProfileIndex = i;
                break;
            }
        }

        if (!selectedProfile) {
            logger.debug('[updateProfileCoinListAfterNotification] strange, the id of the notification is not related to any profile of the logged user'); //should not happen ever
            return;
        }

        //update coin list if needed
        currentCoinList = selectedProfile.coins || [];
        if (!currentCoinList.includes(ticker)) {
            //add it so it shows in wallet without the need to refresh the whole page
            logger.info('[ updateProfileCoinListAfterNotification] ADDING COIN in list');
            const newCoinsList = [...currentCoinList, ticker];

            const newProfile = {
                ...selectedProfile,
                coins: newCoinsList
            };

            const currentProfile = getState().user.currentProfile;
            if (currentProfile.id === ownerProfileId) { //update also state.currentProfile
                dispatch(userSetCurrentProfile(newProfile));
            }
            //update profiles List
            const newProfilesList = profilesList;
            newProfilesList[selectedProfileIndex] = newProfile;
            dispatch(userSetAllProfiles(newProfilesList));

        }
        //else do nothing
    }
};

// get all notifications of current user ===============================================================================
export const notificationGetAllMine = () => {
    const userId = localStorage.getItem('userId');
    return dispatch => {
        dispatch(notificationGetAllMineStart());

        axios.get('/Notifications?filter={"where": {"userId":"' + userId + '"}}')
            .then(response => {
                dispatch(notificationGetAllMineSuccess(response.data.notifications))
            })
            .catch(error => {
                dispatch(notificationGetAllMineFail(error.response));
            })
    }
};

export const notificationGetAllMineStart = () => {
    return {
        type: actionTypes.NOTIFICATION_GET_ALL_MINE_START
    }
};

export const notificationGetAllMineSuccess = (notifications) => {
    return {
        type: actionTypes.NOTIFICATION_GET_ALL_MINE_SUCCESS,
        notifications: notifications
    }
};

export const notificationGetAllMineFail = (error) => {
    return {
        type: actionTypes.NOTIFICATION_GET_ALL_MINE_FAIL,
        error: error
    }
};

// get all unread notifiations of the currently logged user ============================================================
export const notificationGetAllMineUnread = () => {
    const userId = localStorage.getItem('userId');
    return dispatch => {
        dispatch(notificationGetAllMineUnreadStart());

        const filter = JSON.stringify({
            where: {
                and: [
                    { userId: userId },
                    { read: false }
                ]
            }
        });
        axios.get(`/Notifications?filter=${filter}`)
            .then(response => {
                dispatch(notificationGetAllMineUnreadDone(response.data.notifications))
            })
            .catch(error => {
                dispatch(notificationGetAllMineUnreadDone([]));
            });
    }
};

export const notificationGetAllMineUnreadStart = () => {
    return {
        type: actionTypes.NOTIFICATION_GET_ALL_MINE_UNREAD_START
    };
};

export const notificationGetAllMineUnreadDone = (notificationsList) => {
    return {
        type: actionTypes.NOTIFICATION_GET_ALL_MINE_UNREAD_DONE,
        notificationsList
    };
};


// JUST coin sent and received notifications ===========================================================================
export const notificationGetAllMyCoinSentOrReceived = () => {
    const userId = localStorage.getItem('userId');
    return dispatch => {
        dispatch(notificationGetAllMyCoinSentOrReceivedStart());

        const filter = JSON.stringify({
            where: {
                and: [
                    { userId: userId },
                    {
                        or: [
                            { "body.message.message_key": "COIN_SENT" },
                            { "body.message.message_key": "COIN_RECEIVED" },
                        ]
                    }
                ]
            }
        });

        axios.get(`/Notifications?filter=${filter}`)
            .then(response => {
                dispatch(notificationGetAllMyCoinSentOrReceivedSuccess(response.data.notifications))
            })
            .catch(error => {
                dispatch(notificationGetAllMyCoinSentOrReceivedFail(error.response));
            })
    }
};

export const notificationGetAllMyCoinSentOrReceivedStart = () => {
    return {
        type: actionTypes.NOTIFICATION_GET_MY_COIN_SENT_OR_RECEIVED_START
    }
};

export const notificationGetAllMyCoinSentOrReceivedSuccess = (notificationsFiltered) => {
    return {
        type: actionTypes.NOTIFICATION_GET_MY_COIN_SENT_OR_RECEIVED_SUCCESS,
        notificationsFiltered: notificationsFiltered
    }
};

export const notificationGetAllMyCoinSentOrReceivedFail = (error) => {
    return {
        type: actionTypes.NOTIFICATION_GET_MY_COIN_SENT_OR_RECEIVED_FAIL,
        error: error
    }
};

// set a notification as read on db ====================================================================================
export const notificationSetRead = (notificationId) => {
    return dispatch => {
        dispatch(notificationSetReadStart());

        axios.patch(`Notifications/read/${notificationId}`)
            .then(response => {
                logger.info('notificationSetRead success');
                dispatch(notificationSetReadDone(null));
            })
            .catch(error => {
                logger.info('notificationSetRead failure');
                dispatch(notificationSetReadDone(error));
            });
    }
};

export const notificationSetReadStart = () => {
    return {
        type: actionTypes.NOTIFICATION_SET_READ_START,
    };
};

export const notificationSetReadDone = (error) => {
    return {
        type: actionTypes.NOTIFICATION_SET_READ_DONE,
        error
    }
};
