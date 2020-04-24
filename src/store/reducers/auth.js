// Auth Reducer for authentication actions

//Importing action types
import * as actionTypes from '../actions/actionTypes';

//Utility for updating the state in a leaner way
import { updateObject } from '../../utilities/utilities';

const initialState = {
    //isAuthenticated: false,
    error: null,
    loading: false,
    authCode: null,
    idToken: null,
    //userData: null,
    authRedirectPath: '/'
}

const authStart = (state, action) => {
    return updateObject( state, { error: null, loading: true } );
};


const authCodeGet = (state, action) => {
    return updateObject( state, { authCode: action.authCode })
};

const authSuccess = (state, action) => {
    //const newUserData = updateObject(state.userData, action.userData);
    return updateObject( state, {
        authCode: null,
        error: null,
        loading: false,
        idToken: action.idToken,
        //userData: newUserData
    })
};

const authFail = (state,action) => {
    return updateObject( state, {error: action.error})
};

const setAuthRedirectPath = (state, action) => {
    return updateObject(state, { authRedirectPath: action.path })
}

const authLogout = (state, action) => {
    return updateObject(state, initialState);
};


const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.AUTH_START: return authStart(state,action);
        case actionTypes.AUTH_CODE_GET: return authCodeGet(state,action);
        case actionTypes.AUTH_SUCCESS: return authSuccess(state,action);
        case actionTypes.AUTH_FAIL: return authFail(state,action);
        case actionTypes.AUTH_LOGOUT: return authLogout(state, action);
        case actionTypes.SET_AUTH_REDIRECT_PATH: return setAuthRedirectPath(state,action);
        default: return state;
    }
};

export default reducer;
