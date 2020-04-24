//Import axios HOC for REST Call to strongloop
import axios, {loadToken} from '../../utilities/backend/axios-strongloop'

// Import action types
import * as actionTypes from './actionTypes';

import {logger} from '../../utilities/winstonLogging/winstonInit';


//SYNC Action Creators to be dispatched

//Auth process started
export const authStart = () => {
    return {
        type: actionTypes.AUTH_START

    };
};

//Auth process succeeded (Get token and userID)
export const authSuccess = (token) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        idToken: token,
        //userData: userData
    };
};

//Auth process Failed
export const authFail = (error) => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: error
    };
};

//sync logout
export const logout = () => {
    return {
        type: actionTypes.AUTH_LOGOUT
    };
};

//async logout from backend
export const logoutFromBackend = () => {

    return dispatch => {
        //Logout from backend

        dispatch(authStart());

        axios.post('/Persons/logout')
            .then(resolve => {
                    localStorage.clear();
                    dispatch(logout())
            }
                )
            .catch(error => {
                logger.error(error);
                localStorage.clear();
                dispatch(authFail(error.message));
                dispatch(logout())
            })
    }

};

export const setAuthRedirectPath = (path) => {
    return {
        type: actionTypes.SET_AUTH_REDIRECT_PATH,
        path: path
    };
};


//Verify auth on client side (I have an auth token)
export const checkAuthOnClient = () => {
    return dispatch => {
        dispatch(authStart());

        //Find token on local Storage
        const token = localStorage.getItem('token');
        if (!token) {
            logger.info('no token');
            dispatch(logout());
           //dispatch(actions.userDelete())
        } else {

            //Verify Expiration date
            const localExpirationDate = localStorage.getItem('expiresIn');
             if (localExpirationDate) {
                 const expirationDate = new Date(localExpirationDate);
                if (expirationDate <= new Date()) {
                    dispatch(logoutFromBackend());
                } else {
                    dispatch(authSuccess(token));
                }
            }

            else {
                 dispatch(logoutFromBackend());
             }

        }
    }
};

export const checkAuthOnServer = (type, data) => {
    return dispatch => {
        dispatch(authStart());
       //dispatch(authCodeGet(authCode));
        //Trying to get token from strongloop backend
        //let token = null;

        logger.info('TYPE: '+ type +' DATA: '+data);
        axios.get('/token/authToken',
            {
                params: {
                    type: type,
                    data: data
                }
            }
        )
            .then (response => {
                const expiresIn = new Date (response.data.expires_at.$data);
                const token = response.data.id;
                const userId = response.data.userId;
                const memberId = response.data.member_id;
                localStorage.setItem('member_id', memberId);
                localStorage.setItem('expiresIn', expiresIn);
                localStorage.setItem('token', token);
                localStorage.setItem('userId', userId);
                

                loadToken();

                dispatch (authSuccess(token));

            }).catch(error => {
                dispatch(authFail(error));
                logger.error(error)
        })

    }
};


