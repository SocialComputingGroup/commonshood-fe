// Authentication action types
export const AUTH_START = 'AUTH_START';
export const AUTH_FIRSTLIFE = 'AUTH_FIRSTLIFE';
export const AUTH_FROM_SOCIAL = 'AUTH_FROM_SOCIAL';
export const AUTH_CODE_GET = 'AUTH_CODE_GET';
export const AUTH_SUCCESS = 'AUTH_SUCCESS';
export const AUTH_FAIL = 'AUTH_FAIL';
export const AUTH_LOGOUT = 'AUTH_LOGOUT';
export const SET_AUTH_REDIRECT_PATH = 'SET_AUTH_REDIRECT_PATH';

//User Actions
export const USER_START = 'USER_START';
export const USER_GET_ID = 'USER_GET_ID';
export const USER_GET = 'USER_GET';
export const USER_DELETE = 'USER_DELETE';
export const USER_GET_LIST_START = 'USER_GET_LIST_START';
export const USER_GET_LIST_SUCCESS = 'USER_GET_LIST_SUCCESS';
export const USER_GET_LIST_FAIL = 'USER_GET_LIST_FAIL';

export const USER_SET_CURRENT_PROFILE = 'USER_SET_CURRENT_PROFILE';
export const USER_SET_ALL_PROFILES = 'USER_SET_ALL_PROFILES';

export const USER_ADD_CROWDSALE_TO_WAITING_TRANSACTION_CONFIRMATION = 'USER_ADD_CROWDSALE_TO_WAITING_TRANSACTION_CONFIRMATION';
export const USER_REMOVE_CROWDSALE_FROM_WAITING_TRANSACTION_CONFIRMATION = 'USER_REMOVE_CROWDSALE_FROM_WAITING_TRANSACTION_CONFIRMATION';

export const USER_PRESELECT_CONTACT = 'USER_PRESELECT_CONTACT';
export const USER_REMOVE_PRESELECTED_CONTACT = 'USER_REMOVE_PRESELECTED_CONTACT';

//DAO Actions
export const DAO_START = 'DAO_START';
export const DAO_GET_LIST = 'DAO_GET_LIST';
export const DAO_GET_LIST_SUCCESS = 'DAO_GET_LIST_SUCCESS';
export const DAO_GET_LIST_FAIL = 'DAO_GET_LIST_FAIL';
export const DAO_RESET = 'DAO_RESET';
export const DAO_GET_ID = 'DAO_GET_ID';
export const DAO_GET_START = 'DAO_GET_START';
export const DAO_GET_DELETE = 'DAO_GET_DELETE';
export const DAO_GET_SUCCESS = 'DAO_GET_SUCCESS';
export const DAO_GET_FAIL = 'DAO_GET_FAIL';

//Wallet Actions
export const WALLET_START = 'WALLET_START';
export const WALLET_GET = 'WALLET_GET';

//Coin Actions
//Creation
export const COIN_CREATE_START = 'COIN_CREATE_START';
export const COIN_CREATE = 'COIN_CREATE';
export const COIN_CREATE_SUCCESS = 'COIN_CREATE_SUCCESS';
export const COIN_MINT_AFTER_CREATION = 'COIN_MINT_AFTER_CREATION';
export const COIN_CREATE_FAIL = 'COIN_CREATE_FAIL';
export const COIN_CREATE_RESET = 'COIN_CREATE_RESET';

//Get List for Piggies
export const COIN_FOR_PIGGIES_GET_LIST_START = 'COIN_FOR_PIGGIES_GET_LIST_START';
export const COIN_FOR_PIGGIES_GET_LIST_RESET = 'COIN_FOR_PIGGIES_GET_LIST_RESET';
export const COIN_FOR_PIGGIES_GET_LIST_SUCCESS = 'COIN_FOR_PIGGIES_GET_LIST_SUCCESS';
export const COIN_FOR_PIGGIES_GET_LIST_FAIL = 'COIN_FOR_PIGGIES_GET_LIST_FAIL';

//Get List
export const COIN_GET_LIST_START = 'COIN_GET_LIST_START';
export const COIN_GET_LIST_SUCCESS = 'COIN_GET_LIST_SUCCESS';
export const COIN_GET_LIST_FAIL = 'COIN_GET_LIST_FAIL';
export const COIN_GET_LIST_RESET = 'COIN_GET_LIST_RESET';

//coin Get All Owned
export const COIN_GET_ALL_OWNED_START = 'COIN_GET_ALL_OWNED_START';
export const COIN_GET_ALL_OWNED_SUCCESS = 'COIN_GET_ALL_OWNED_SUCCESS';
export const COIN_GET_ALL_OWNED_FAIL = 'COIN_GET_ALL_OWNED_FAIL';

//Get Balance of a specific coin
export const COIN_GET_BALANCE_START= 'COIN_GET_BALANCE_START';
export const COIN_GET_BALANCE_SUCCESS= 'COIN_GET_BALANCE_SUCCESS';
export const COIN_GET_BALANCE_FAIL= 'COIN_GET_BALANCE_FAIL';
export const COIN_GET_BALANCE_RESET= 'COIN_GET_BALANCE_RESET';

//Send Coin
export const COIN_SEND_START = 'COIN_SEND_START';
export const COIN_SEND_MINING = 'COIN_SEND_MINING';
export const COIN_SEND_SUCCESS = 'COIN_SEND_SUCCESS';
export const COIN_SEND_FAIL = 'COIN_SEND_FAIL';
export const COIN_SEND_RESET = 'COIN_SEND_RESET';

//Mint Coin
export const COIN_MINT_START = 'COIN_MINT_START';
export const COIN_MINT_SUCCESS = 'COIN_MINT_SUCCESS';
export const COIN_MINT_FAIL = 'COIN_MINT_FAIL';
export const COIN_MINT_RESET = 'COIN_MINT_RESET';

//Coin Transactions
export const COIN_TRANSACTIONS_START = 'COIN_TRANSACTIONS_START';
export const COIN_TRANSACTIONS_SUCCESS = 'COIN_TRANSACTIONS_SUCCESS';
export const COIN_TRANSACTIONS_FAIL = 'COIN_TRANSACTIONS_FAIL';

//Preselect Coin for payments
export const COIN_SET_PRESELECTED = 'COIN_SET_PRESELECTED';
export const COIN_UNSET_PRESELECTED = 'COIN_UNSET_PRESELECTED';

//Icons cache
export const COIN_ADD_ICON = 'COIN_ADD_ICON';

//File Actions
//File Upload
export const FILE_UPLOAD_START = 'FILE_UPLOAD_START';
export const FILE_UPLOAD_SUCCESS = 'FILE_UPLOAD_SUCCESS';
export const FILE_UPLOAD_FAIL = 'FILE_UPLOAD_FAIL';
export const FILE_GET_START = 'FILE_GET_START';
export const FILE_GET_SUCCESS = 'FILE_GET_SUCCESS';
export const FILE_GET_FAIL = 'FILE_GET_FAIL';
export const FILE_GET_RESET = 'FILE_GET_RESET';
export const FILE_GET_LIST_START = 'FILE_GET_LIST_START';
export const FILE_GET_LIST_SUCCESS = 'FILE_GET_LIST_SUCCESS';
export const FILE_GET_LIST_FAIL = 'FILE_GET_LIST_FAIL';
export const FILE_GET_LIST_RESET = 'FILE_GET_LIST_RESET';

//Place Actions
export const PLACE_START = 'PLACE_START';
export const PLACE_GET = 'PLACE_GET';
export const PLACE_RESET ='PLACE_RESET';
export const DAOS_GET = "DAOS_GET";


//CrowdSale Actions
export const CROWDSALE_CREATE_START = 'CROWDSALE__CREATE_START';
export const CROWDSALE_CREATE_SUCCESS = 'CROWDSALE_CREATE_SUCCESS';
export const CROWDSALE_CREATE_FAIL = 'CROWDSALE_CREATE_FAIL';
export const CROWDSALE_CREATE_RESET = 'CROWDSALE_CREATE_RESET';
export const CROWDSALE_UNLOCK_SUCCESS = 'CROWDSALE_UNLOCK_SUCCESS';
export const CROWDSALE_UNLOCK_FAIL = 'CROWDSALE_UNLOCK_FAIL';
export const CROWDSALE_GET_ALL_RESET = 'CROWDSALE_GET_ALL_RESET';
export const CROWDSALE_GET_ALL_START = 'CROWDSALE_GET_ALL_START';
export const CROWDSALE_GET_ALL_FAIL = 'CROWDSALE_GET_ALL_FAIL';
export const CROWDSALE_GET_ALL_SUCCESS = 'CROWDSALE_GET_ALL_SUCCESS';
export const CROWDSALE_GET_PARTICIPANT_COIN_BALANCE_START = 'CROWDSALE_GET_PARTICIPANT_COIN_BALANCE_START';
export const CROWDSALE_GET_PARTICIPANT_COIN_BALANCE_DONE = 'CROWDSALE_GET_PARTICIPANT_COIN_BALANCE_DONE';
export const CROWDSALE_GET_PARTICIPANT_RESERVATION_START = 'CROWDSALE_GET_PARTICIPANT_RESERVATION_START';
export const CROWDSALE_GET_PARTICIPANT_RESERVATION_DONE = 'CROWDSALE_GET_PARTICIPANT_RESERVATION_DONE';

export const CROWDSALE_PLEDGE_APPROVAL_STARTED = "CROWDSALE_PLEDGE_APPROVAL_STARTED";
export const CROWDSALE_PLEDGE_APPROVAL_DONE = "CROWDSALE_PLEDGE_APPROVAL_DONE";
export const CROWDSALE_JOIN_DONE = 'CROWDSALE_JOIN_DONE';
export const CROWDSALE_REFUND_DONE = 'CROWDSALE_REFUND_DONE';
export const CROWDSALE_REFUND_RESET = 'CROWDSALE_REFUND_RESET';
export const CROWDSALE_JOIN_RESET = 'CROWDSALE_JOIN_RESET';

export const CROWDSALE_GET_STATUS_RESET = 'CROWDSALE_GET_STATUS_RESET';
export const CROWDSALE_GET_STATUS_DONE = 'CROWDSALE_GET_STATUS_DONE';
export const CROWDSALE_GET_COMPLETE_RESERVATION_RESET = 'CROWDSALE_GET_COMPLETE_RESERVATION_RESET';
export const CROWDSALE_GET_COMPLETE_RESERVATION_DONE = 'CROWDSALE_GET_COMPLETE_RESERVATION_DONE';
//Icons cache
export const CROWDSALE_ADD_ICON = 'CROWDSALE_ADD_ICON';


export const PLACE_FAIL = 'PLACE_FAIL';

//Notification Actions
export const NOTIFICATION_SET_READ_START = 'NOTIFICATION_SET_READ_START';
export const NOTIFICATION_SET_READ_DONE = 'NOTIFICATION_SET_READ_DONE';

export const NOTIFICATION_GET_ALL_MINE_UNREAD_START = 'NOTIFICATION_GET_ALL_MINE_UNREAD_START';
export const NOTIFICATION_GET_ALL_MINE_UNREAD_DONE = 'NOTIFICATION_GET_LIST_OF_UNREAD_START_DONE';

export const NOTIFICATION_GET_ALL_MINE_START = 'NOTIFICATION_GET_ALL_MINE_START';
export const NOTIFICATION_GET_ALL_MINE_SUCCESS = 'NOTIFICATION_GET_ALL_MINE_SUCCESS';
export const NOTIFICATION_GET_ALL_MINE_FAIL = 'NOTIFICATION_GET_ALL_MINE_FAIL';

export const NOTIFICATION_GET_MY_COIN_SENT_OR_RECEIVED_START = 'NOTIFICATION_GET_MY_COIN_SENT_OR_RECEIVED_START';
export const NOTIFICATION_GET_MY_COIN_SENT_OR_RECEIVED_SUCCESS = 'NOTIFICATION_GET_MY_COIN_SENT_OR_RECEIVED_SUCCESS';
export const NOTIFICATION_GET_MY_COIN_SENT_OR_RECEIVED_FAIL = 'NOTIFICATION_GET_MY_COIN_SENT_OR_RECEIVED_FAIL';

export const NOTIFICATION_SOCKET_AUTHENTICATION_START = 'NOTIFICATION_SOCKET_AUTHENTICATION_START';
export const NOTIFICATION_SOCKET_AUTHENTICATION_DONE = 'NOTIFICATION_SOCKET_AUTHENTICATION_DONE';
export const NOTIFICATION_SOCKET_LISTENING = 'NOTIFICATION_SOCKET_LISTENING';
export const NOTIFICATION_SOCKET_NOT_LISTENING = 'NOTIFICATION_SOCKET_NOT_LISTENING';
export const NOTIFICATION_SOCKET_GOT_NEW_MESSAGE = 'NOTIFICATION_SOCKET_GOT_NEW_MESSAGE';
export const NOTIFICATION_REMOVE_FROM_CURRENTLY_LISTED = 'NOTIFICATION_REMOVE_FROM_CURRENTLY_LISTED';

export const NOTIFICATION_WEB3_LISTENING = 'NOTIFICATION_WEB3_LISTENING';
export const NOTIFICATION_WEB3_NOT_LISTENING = 'NOTIFICATION_WEB3_NOT_LISTENING';
export const NOTIFICATION_WEB3_GOT_NEW_MESSAGE = 'NOTIFICATION_WEB3_GOT_NEW_MESSAGE';

//UI
export const UI_BOTTOM_MENU_INDEX_CHANGE = 'UI_BOTTOM_MENU_INDEX_CHANGE';

//WEB3
export const WEB3_SET_METAMASK_PRESENCE = 'WEB3_SET_METAMASK_PRESENCE';
export const WEB3_START_CHECK = 'WEB3_START_CHECK';
