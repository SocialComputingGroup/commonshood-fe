import {createSlice, Dispatch, PayloadAction} from "@reduxjs/toolkit";
import {updateObject} from "../../utilities/utilities";
import {logger} from "../../utilities/winstonLogging/winstonInit";
import {RootState} from "../store";
import {getDataById, getDataByParams, getList, getWallet} from "../../api/userAPI";
import md5 from 'md5';

type UserType = {
    user: any,
    userIsFound: boolean | any,
    loading: boolean,
    userList: any,
    currentProfile: any,
    profilesList: any,
    preselectedContact: any,
    error: any,
}

const initialState: UserType = {
    user: null,
    userIsFound: null,
    loading: false,
    userList: null,
    currentProfile: null,
    profilesList: null,
    preselectedContact: null,
    error: null
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        userStart(state) {
            state.loading = true;
        },

        userGet(state, action: PayloadAction<{ userFound: any, userData: any }>) {
            if (action.payload.userFound) {
                state.user = action.payload.userData;
                state.userIsFound = true;
                state.loading = false;
            } else {
                state.user = null;
                state.userIsFound = false;
                state.loading = false;
            }
        },

        userDelete(state) {
            state.user = null;
            state.userIsFound = null;
            state.loading = false;
            state.userList = null;
        },


        userGetListStart(state) {
            state.loading = true;
        },

        userGetListSuccess(state, action: PayloadAction<{ userList: any }>) {
            state.userList = action.payload.userList;
            state.loading = false;
        },

        userGetListFail(state, action: PayloadAction<{ error: any }>) {
            state.loading = false;
            state.error = action.payload.error;
        },

        userSetCurrentProfile(state, action: PayloadAction<{ profile: any }>) {
            state.currentProfile = action.payload.profile;
        },

        userSetAllProfiles(state, action: PayloadAction<{ profilesList: any }>) {

            state.profilesList = action.payload.profilesList;

        },

        userAddCrowdsaleToWaitingTransactionConfirmation(state, action: PayloadAction<{ crowdsaleId: number }>) {
            let newProfile = state.currentProfile;
            if (newProfile.hasOwnProperty('crowdsalesWithPendingTransaction')) {
                newProfile.crowdsalesWithPendingTransaction.add(action.payload.crowdsaleId);
            } else {
                newProfile.crowdsalesWithPendingTransaction = new Set();
                newProfile.crowdsalesWithPendingTransaction.add(action.payload.crowdsaleId);
            }
            state.currentProfile = newProfile;
        },

        userRemoveCrowdsaleFromWaitingTransactionConfirmation(state, action: PayloadAction<{ crowdsaleId: number }>) {
            let newProfile = state.currentProfile;
            if (
                !newProfile.hasOwnProperty('crowdsalesWithPendingTransaction') ||
                !newProfile.crowdsalesWithPendingTransaction.has(action.payload.crowdsaleId)
            ) {
                //nothing to remove (until the transaction management is implemented also server side, this is possible FIXME)
            } else {
                newProfile.crowdsalesWithPendingTransaction.delete(action.payload.crowdsaleId);
                state.currentProfile = newProfile;
            }
        },

        userPreselectContact(state, action: PayloadAction<{ contact: any }>) {

            state.preselectedContact = action.payload.contact;

        },

        userRemovePreselectedContact(state) {
            state.preselectedContact = null;
        },

    }
});

export const {
    userStart,
    userGet,
    userDelete,
    userGetListStart,
    userGetListSuccess,
    userGetListFail,
    userSetCurrentProfile,
    userSetAllProfiles,
    userAddCrowdsaleToWaitingTransactionConfirmation,
    userRemoveCrowdsaleFromWaitingTransactionConfirmation,
    userPreselectContact,
    userRemovePreselectedContact,
} = userSlice.actions;

export const userGetData = () => {
    return (dispatch: Dispatch) => {
        dispatch(userDelete());
        dispatch(userStart());

        const userId = localStorage.getItem('userId');
        getDataById(userId)
            .then (response => {
                    const userData = {
                        ...response.data,
                        avatar: calculateAvatar(response.data.email,response.data.name)
                    };
                    dispatch(userGet({userData, userFound: true}))
                }
            )
            .catch(error => {
                logger.error("userGetData error:", error);
            })
    }
};

export const userGetDataFromId = (userId: string) => {
    return (dispatch: Dispatch) => {

        dispatch(userDelete());
        dispatch(userStart());
        logger.info('userGetDataFromId: ', userId);
        getDataById(userId)
            .then (response => {
                    logger.info('userGetDataFromId, response: ', response);
                    const userData = {
                        ...response.data,
                        avatar: calculateAvatar(response.data.email,response.data.name)
                    };
                    dispatch(userGet({userData, userFound: true}));
                }
            )
            .catch(error => {
                dispatch(userGet({userData:null, userFound:false}));
                logger.error('UserGetDataFromId error: ', error);
            })
    }
};

const calculateAvatar = (email: string,name: string) => {
    const emailHash = md5(email.trim().toLowerCase());
    let uiAvatars = 'https://ui-avatars.com/api/'+name+'/64/ddd/222/2/0.5/true';
    const avatarURL = 'https://www.gravatar.com/avatar/' + emailHash + '/?d=' + encodeURI(uiAvatars);
    return avatarURL;
};

//Get user List (can exclude current logged user)
export const userGetListData = (byName: string) => {
    return async (dispatch: Dispatch, getState: () => RootState) => {
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
            params = updateObject(params, filter);
        }

        getDataByParams(params)
            .then ( async response => {
                    const retrieverList = [...response.data];
                    const localUserList = [];
                    const userListLength = retrieverList.length;
                    for (let i = 0; i < userListLength; i++) {
                        // checking if the user has a wallet, else will not show him
                        const res = await getWallet(retrieverList[i].id);
                        if( res.data != null && res.data.length !== 0){
                            const enrichedUser = {
                                ...retrieverList[i],
                                icon: calculateAvatar(retrieverList[i].email,retrieverList[i].name)
                            };
                            localUserList.push(enrichedUser)
                        }
                    }
                    dispatch(userGetListSuccess({userList:localUserList}))
                }
            )
            .catch(error => {
                logger.error('userGetListData error:', error);
                dispatch(userGetListFail(error));
            })
    }
};

//Get user List by ids
export const userGetListByids = (userIds: number[]) => {
    return  (dispatch: Dispatch) => {
        dispatch(userStart());
        getList(userIds)
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
                    dispatch(userGetListSuccess({userList:localUserList}))
                }
            )
            .catch(error => {
                logger.error('userGetListByids error: ', error);
                dispatch(userGetListFail(error));
            })
    }
};

export default userSlice.reducer;