//Importing action types
import * as actionTypes from '../actions/actionTypes';

//Utility for updating the state in a leaner way
import { updateObject } from '../../utilities/utilities';

const initialState = {
    user: null,
    userIsFound: null,
    loading: false,
    userList: null,
    currentProfile: null,
    profilesList: null,
    preselectedContact: null,
};

const userStart = (state, action) => {
    return updateObject(state, {loading: true});
};

const userGet = (state, action) => {
    if(action.userFound) {
        const newUserData = action.userData;
        return {...state,
                user: newUserData,
                userIsFound: true,
                loading: false};
    }else{
        return {...state,
                user: null,
                userIsFound: false,
                loading: false};
    }
};

const userDelete = (state,action) => {
    return updateObject(state,{user: null, userIsFound: null, loading:false, userList: null})
};


const userGetListStart = (state, action) => {
    return updateObject(state, {loading: true});
};

const userGetListSuccess = (state, action) => {
    return updateObject(state, {userList: action.userList, loading: false})
};

const userGetListFail = (state, action) => {
    return updateObject(state, {loading: false, error: action.error});
};

const userSetCurrentProfile = (state, action) => {
    return {
        ...state,
        currentProfile: action.profile
    };
};

const userSetAllProfiles = (state, action) => {
    return {
        ...state,
        profilesList: action.profilesList,
    }
};

const userAddCrowdsaleToWaitingTransactionConfirmation = (state, action) => {
    let newProfile = {...state.currentProfile};
    if(newProfile.hasOwnProperty('crowdsalesWithPendingTransaction')){
        newProfile.crowdsalesWithPendingTransaction.add(action.crowdsaleId);
    }else{
        newProfile.crowdsalesWithPendingTransaction = new Set();
        newProfile.crowdsalesWithPendingTransaction.add(action.crowdsaleId);
    }
    return{
        ...state,
        currentProfile: newProfile,
    }
};

const userRemoveCrowdsaleFromWaitingTransactionConfirmation = (state, action) =>{
    let newProfile = {...state.currentProfile};
    if(
        !newProfile.hasOwnProperty('crowdsalesWithPendingTransaction') ||
        !newProfile.crowdsalesWithPendingTransaction.has(action.crowdsaleId)
    ){
        //nothing to remove (until the transaction management is implemented also server side, this is possible FIXME)
        return{
            ...state,
        };
    }

    newProfile.crowdsalesWithPendingTransaction.delete(action.crowdsaleId);
    return{
        ...state,
        currentProfile: newProfile
    }
};

const userPreselectContact = (state, action) => {
    return{
        ...state,
        preselectedContact: action.contact
    }
};

const userRemovePreselectedContact = (state, action) =>{
    return{
        ...state,
        preselectedContact: null,
    }
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.USER_GET: return userGet(state,action);
        case actionTypes.USER_DELETE: return userDelete(state,action);
        case actionTypes.USER_START: return userStart(state,action);
        case actionTypes.USER_GET_LIST_START: return userGetListStart(state,action);
        case actionTypes.USER_GET_LIST_SUCCESS: return userGetListSuccess(state,action);
        case actionTypes.USER_GET_LIST_FAIL: return userGetListFail(state,action);

        case actionTypes.USER_SET_CURRENT_PROFILE: return userSetCurrentProfile(state,action);
        case actionTypes.USER_SET_ALL_PROFILES: return userSetAllProfiles(state,action);

        case actionTypes.USER_ADD_CROWDSALE_TO_WAITING_TRANSACTION_CONFIRMATION: return userAddCrowdsaleToWaitingTransactionConfirmation(state,action);
        case actionTypes.USER_REMOVE_CROWDSALE_FROM_WAITING_TRANSACTION_CONFIRMATION: return userRemoveCrowdsaleFromWaitingTransactionConfirmation(state,action);

        case actionTypes.USER_PRESELECT_CONTACT: return userPreselectContact(state,action);
        case actionTypes.USER_REMOVE_PRESELECTED_CONTACT: return userRemovePreselectedContact(state,action);

        default: return state;
    }
}

export default reducer;