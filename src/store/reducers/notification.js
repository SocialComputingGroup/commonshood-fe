// Notification Reducer for Notification messages management actions
import {logger} from '../../utilities/winstonLogging/winstonInit';

//Importing action types
import * as actionTypes from '../actions/actionTypes';

const initialState = {
    error: null,
    loading: false,

    notificationSocketAuthenticating: false,
    notificationSocketAuthenticated: false,

    notificationSocketListening: false,
    notificationsOfCurrentSession: [],

    unreadNotificationsLoading: false,
    unreadNotificationsLoaded: false,

    loadingNotifications: false,
    notifications : [],

    loadingNotificationsFiltered: false,
    notificationsFiltered: [],

    notificationSetReadError: null,
};

const notificationGetAllMineStart = (state, action) => {
    return {
        ...state,
        error: null,
        loadingNotifications: true, 
        notifications: [],
    };
};

const notificationGetAllMineSuccess = (state, action) => {
    let newNotifications = action.notifications ? action.notifications : [];
    newNotifications = newNotifications.sort( (a,b) => {
        const aTimeOfCreation = new Date(a.timestamp);
        const bTimeOfCreation = new Date(b.timestamp);
        return aTimeOfCreation - bTimeOfCreation;
    });
    return {
        ...state, 
        loadingNotifications: false, 
        notifications : newNotifications
    };
};

const notificationGetAllMineFail = (state, action) => {
    return {
        ...state,
        loadingNotifications: false,
        error: action.error,
    };
};

const notificationSocketAuthenticationStart = (state, action) => {
    return {
        ...state,
        notificationSocketAuthenticating: true,
    };
};

const notificationSocketAuthenticationDone = (state, action) => {
    return {
        ...state,
        notificationSocketAuthenticating: false,
        notificationSocketAuthenticated: !action.error,
    };
};

const notificationSocketListening = (state, action) => {
    return{
        ...state,
        notificationSocketListening: true,
    };
};

const notificationSocketNotListening = (state, action) => {
    return{
        ...state,
        notificationSocketListening: false,
    };
};

const notificationSocketGotNewMessage = (state, action) => {
    logger.info("notification, notificationsOfCurrentSession: ", state.notificationsOfCurrentSession);
    let notifications = [...state.notificationsOfCurrentSession];
    const newNotification = action.newNotification;
    if(newNotification.id == null){
       newNotification.id = newNotification._id; //to uniform to preexisting notifications
    }
    notifications.unshift(newNotification);
    return {
        ...state,
        notificationsOfCurrentSession: notifications
    };
};

const notificationWeb3Listening = (state, action) => {
    return{
        ...state,
        notificationWeb3Listening: true,
    };
};

const notificationWeb3NotListening = (state, action) => {
    return{
        ...state,
        notificationWeb3Listening: false,
    };
};

const notificationWeb3GotNewMessage = (state, action) => {
    logger.info("notification, notificationsOfCurrentSession: ", state.notificationsOfCurrentSession);
    let notifications = [...state.notificationsOfCurrentSession];
    const newNotification = action.newNotification;
    // FIXME: add event logic here
    if(newNotification.id == null){
       newNotification.id = newNotification._id; //to uniform to preexisting notifications
    }
    notifications.unshift(newNotification);
    return {
        ...state,
        notificationsOfCurrentSession: notifications
    };
};

const notificationRemoveFromCurrentlyListed = (state, action) => {
    let notifications = [...state.notificationsOfCurrentSession];
    notifications = notifications.filter(  (currentItem) => {
        return currentItem.id !== action.messageId;
    });
    return {
        ...state,
        notificationsOfCurrentSession: notifications,
    };
};

const notificationGetMineUnreadListStart = (state, action) => {
    return{
        ...state,
        unreadNotificationsLoading: true,
        unreadNotificationsLoaded: false,
    };
};

const notificationGetMineUnreadListDone = (state, action) => {
    let notifications = [...action.notificationsList].sort( (a,b) => { //order with last created in 0 position
        const aTimeOfCreation = new Date(a.timestamp);
        const bTimeOfCreation = new Date(b.timestamp);
        return bTimeOfCreation - aTimeOfCreation;
    });
    notifications = [...state.notificationsOfCurrentSession, ...notifications];
    return{
        ...state,
        unreadNotificationsLoading: false,
        unreadNotificationsLoaded: true,
        notificationsOfCurrentSession: notifications,
    };
};


const notificationsGetMyCoinSentOrReceivedStart = (state, action) => {
    return {
        ...state,
        error: null,
        loadingNotificationsFiltered: true, 
        notificationsFiltered: [],
    };
};

const notificationsGetMyCoinSentOrReceivedSuccess = (state, action) => {
    const newNotifications = action.notificationsFiltered;
    return {
        ...state, 
        loadingNotificationsFiltered: false, 
        notificationsFiltered : newNotifications
    };
};

const notificationsGetMyCoinSentOrReceivedFail = (state, action) => {
    return {
        ...state,
        loadingNotificationsFiltered: false,
        error: action.error,
    };
};


const notificationsSetReadStart = (state, action) => {
    return {
        ...state,
        notificationSetReadError: null,
    };
};

const notificationSetReadDone = (state, action) => {
    return {
        ...state,
        notificationSetReadError: action.error,
    };
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.NOTIFICATION_GET_ALL_MINE_START: return notificationGetAllMineStart(state,action);
        case actionTypes.NOTIFICATION_GET_ALL_MINE_SUCCESS: return notificationGetAllMineSuccess(state,action);
        case actionTypes.NOTIFICATION_GET_ALL_MINE_FAIL: return notificationGetAllMineFail(state,action);

        case actionTypes.NOTIFICATION_GET_MY_COIN_SENT_OR_RECEIVED_START: return notificationsGetMyCoinSentOrReceivedStart(state,action);
        case actionTypes.NOTIFICATION_GET_MY_COIN_SENT_OR_RECEIVED_SUCCESS: return notificationsGetMyCoinSentOrReceivedSuccess(state,action);
        case actionTypes.NOTIFICATION_GET_MY_COIN_SENT_OR_RECEIVED_FAIL: return notificationsGetMyCoinSentOrReceivedFail(state,action);

        case actionTypes.NOTIFICATION_GET_ALL_MINE_UNREAD_START: return notificationGetMineUnreadListStart(state,action);
        case actionTypes.NOTIFICATION_GET_ALL_MINE_UNREAD_DONE: return notificationGetMineUnreadListDone(state, action);

        case actionTypes.NOTIFICATION_SOCKET_AUTHENTICATION_START: return notificationSocketAuthenticationStart(state, action);
        case actionTypes.NOTIFICATION_SOCKET_AUTHENTICATION_DONE: return notificationSocketAuthenticationDone(state, action);

        case actionTypes.NOTIFICATION_SOCKET_LISTENING: return notificationSocketListening(state, action);
        case actionTypes.NOTIFICATION_SOCKET_NOT_LISTENING: return notificationSocketNotListening(state,action);
        case actionTypes.NOTIFICATION_SOCKET_GOT_NEW_MESSAGE: return notificationSocketGotNewMessage(state,action);
        
        case actionTypes.NOTIFICATION_WEB3_LISTENING: return notificationWeb3Listening(state, action);
        case actionTypes.NOTIFICATION_WEB3_NOT_LISTENING: return notificationWeb3NotListening(state,action);
        case actionTypes.NOTIFICATION_WEB3_GOT_NEW_MESSAGE: return notificationWeb3GotNewMessage(state,action);

        case actionTypes.NOTIFICATION_REMOVE_FROM_CURRENTLY_LISTED: return notificationRemoveFromCurrentlyListed(state,action);

        case actionTypes.NOTIFICATION_SET_READ_START: return notificationsSetReadStart(state,action);
        case actionTypes.NOTIFICATION_SET_READ_DONE: return notificationSetReadDone(state,action);
        default: return state;
    }
};

export default reducer;