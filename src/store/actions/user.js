//
//  Redux User Action dispatchers
//
import md5 from 'md5'
import {logger} from '../../utilities/winstonLogging/winstonInit';
// Action types
import * as actionTypes from './actionTypes';

// axios Authenticated wrapper for strongloop REST queries
import axiosAuth from '../../utilities/backend/axios-strongloop';

//Copy object utility
import { updateObject } from '../../utilities/utilities'

// SYNC Action dispatchers

export const userStart = () => {
    return {
        type: actionTypes.USER_START
    }
};

// User get
export const userGet = (user, userFound) => {
    return {
        type: actionTypes.USER_GET,
        userData: user,
        userFound
    };
};

export const userDelete = () => {
    return {
        type: actionTypes.USER_DELETE
    }
};

// Get the list of users
export const userGetListStart = () => {
    return {
        type: actionTypes.USER_GET_LIST_START
    }
};


export const userGetListSuccess = (userList) => {
    return {
        type: actionTypes.USER_GET_LIST_SUCCESS,
        userList: userList
    }
};

export const userGetListFail = (error) => {
    return {
        type: actionTypes.USER_GET_LIST_FAIL,
        error: error
    }
};


export const userSetCurrentProfile = (profile) => {
    logger.info('[on USER SET PROFILE] => ', profile);
    return {
        type: actionTypes.USER_SET_CURRENT_PROFILE,
        profile: {...profile},
    };
};

export const userSetAllProfiles = (profilesList) => {
    logger.info('[on setAllProfiles', profilesList);
    return{
        type: actionTypes.USER_SET_ALL_PROFILES,
        profilesList,
    };
};


export const userAddCrowdsaleToWaitingTransactionConfirmation = (crowdsaleId) => {
    logger.info('[on userAddCrowdsaleToWaitingTransactionConfirmation] crowdsaleId=', crowdsaleId);
    return{
        type: actionTypes.USER_ADD_CROWDSALE_TO_WAITING_TRANSACTION_CONFIRMATION,
        crowdsaleId
    }
};

export const userRemoveCrowdsaleFromWaitingTransactionConfirmation = (crowdsaleId) => {
    logger.info('[on userRemoveCrowdsaleFromWaitingTransactionConfirmation] crowdsaleId=', crowdsaleId);
    return{
        type: actionTypes.USER_REMOVE_CROWDSALE_FROM_WAITING_TRANSACTION_CONFIRMATION,
        crowdsaleId
    }
};


//contact preselection for coinSend
export const userPreselectContact = (contact) => {
    return{
        type: actionTypes.USER_PRESELECT_CONTACT,
        contact
    };
};

export const userRemovePreselectedContact = () =>{
    return{
        type: actionTypes.USER_REMOVE_PRESELECTED_CONTACT,
    };
};



//ASYNC Action creators

// Get ID
export const userGetData = () => {
    return dispatch => {
        dispatch(userDelete());
        dispatch(userStart());

        const userId = localStorage.getItem('userId');
        axiosAuth.get('/Persons/'+userId)
            .then (response => {

                const localUser = {
                    ...response.data,
                    avatar: calculateAvatar(response.data.email,response.data.name)
                };
                dispatch(userGet(localUser, true))
            }
            )
            .catch(error => {
                logger.error("userGetData error:", error);
            })
    }
};

export const userGetDataFromId = (userId) => {
    return dispatch => {

        dispatch(userDelete());
        dispatch(userStart());
        logger.info('userGetDataFromId: ', userId);
        axiosAuth.get('/Persons/'+userId)
            .then (response => {
                    logger.info('userGetDataFromId, response: ', response);

                    const localUser = {
                        ...response.data,
                        avatar: calculateAvatar(response.data.email,response.data.name)
                    };
                    dispatch(userGet(localUser, true));
                }
            )
            .catch(error => {
                dispatch(userGet(null, false));
                logger.error('UserGetDataFromId error: ', error);
            })
    }
};

const calculateAvatar = (email,name) => {
    const emailHash = md5(email.trim().toLowerCase());
    let uiAvatars = 'https://ui-avatars.com/api/'+name+'/64/ddd/222/2/0.5/true';
    const avatarURL = 'https://www.gravatar.com/avatar/' + emailHash + '/?d=' + encodeURI(uiAvatars);
    return avatarURL;
};

//Get user List (can exclude current logged user)
export const userGetListData = (byName) => {
    return async(dispatch, getState) => {
        dispatch(userStart());
        let params = {};

        let filter = null;

        if (byName && byName !== '')  {
             filter = {"filter": {"where": {"name": {"like": byName, "options": "i"} }}};
        }

        const userId = localStorage.getItem('userId');

        //const currentProfile = JSON.parse( window.localStorage.getItem('currentProfile') );
        const currentProfile = getState().user.currentProfile;
        if(userId === currentProfile.id) { //I am logged as user, I don't want to appear in the search
            const clause = {"id": {"neq": userId}};
             if (!filter) {
                 filter = { "filter": {"where": clause }}
             } else {
                 filter = updateObject(filter,
                     {"filter": {"where": updateObject(filter["filter"]["where"],clause)}}
                     );
             }
        }
        if (filter) {
            params.params = updateObject(params.params, filter);
        }

        axiosAuth.get('/Persons/', params)
            .then ( async response => {
                    const retrieverList = [...response.data];
                    const localUserList = [];
                    const userListLength = retrieverList.length;
                    for (let i = 0; i < userListLength; i++) {
                        // checking if the user has a wallet, else will not show him
                        const getFilter = `{"where": {"userId": "${retrieverList[i].id}" }}`
                        const res = await axiosAuth.get('/Bank?filter=' + getFilter);

                        if( res.data != null && res.data.length !== 0){
                            const enrichedUser = {
                                ...retrieverList[i],
                                icon: calculateAvatar(retrieverList[i].email,retrieverList[i].name)
                            };
                            localUserList.push(enrichedUser)
                        }
                    }



                    dispatch(userGetListSuccess(localUserList))
                }
            )
            .catch(error => {
                logger.error('userGetListData error:', error);
                dispatch(userGetListFail(error));
            })
    }
};

//Get user List by ids
export const userGetListByids = (userIds) => {
    return (dispatch, getState) => {
        dispatch(userStart());
        let params = {};

        let filter = '{"where": {"id": {"inq": [';

        userIds.forEach(function(id) {
            filter = filter + '"'+id+'",'
          });

        filter = filter.slice(0,filter.lastIndexOf(","))+']}}}';
        
        axiosAuth.get('/Persons?filter='+filter, params)
            .then (response => {
                    const retrieverList = [...response.data];
                    const localUserList = [];
                    const userListLength = retrieverList.length;
                    for (let i = 0; i < userListLength; i++) {
                        const enrichedUser = {
                            ...retrieverList[i],
                            icon: calculateAvatar(retrieverList[i].email,retrieverList[i].name),
                            mostContacted: true
                        };
                        localUserList.push(enrichedUser)
                    }
                    dispatch(userGetListSuccess(localUserList))
                }
            )
            .catch(error => {
                logger.error('userGetListByids error: ', error);
                dispatch(userGetListFail(error));
            })
    }
};