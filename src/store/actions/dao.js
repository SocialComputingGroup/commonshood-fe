//
// DAO Action creator
//
import {logger} from '../../utilities/winstonLogging/winstonInit';

//Import axios HOC for REST Call to strongloop
import axios from '../../utilities/backend/axios-strongloop'
//import axios_helper from 'axios';

import * as actionTypes from "./actionTypes";

export const daoStart = () => {
    return {
        type: actionTypes.DAO_START
    }
};

// export const daoGetFromUser = () => {
//     return {
//         type: actionTypes.DAO_GET_LIST
//     }
// };

export const daoGetFromUserSuccess = (daoList) => {
    return {
        type: actionTypes.DAO_GET_LIST_SUCCESS,
        daoList: daoList
    }
};

export const daoGetFromUserFail = (error) => {
    return {
        type: actionTypes.DAO_GET_LIST_FAIL,
        daoList: error
    }
};

export const daoReset = () => {
    return {
        type: actionTypes.DAO_RESET,
    }
};

export const daoGetStart = () => {
    return{
        type: actionTypes.DAO_GET_START,
    }
};

export const daoGetDelete = () =>{
    return{
        type: actionTypes.DAO_GET_DELETE,
    }
};

export const daoGetSuccess = (daoData) => {
    return {
        type: actionTypes.DAO_GET_SUCCESS,
        dao: daoData
    }
};

export const daoGetFail = (error) => {
    return {
        type: actionTypes.DAO_GET_FAIL,
        error: error
    }
};

// Async Actions
export const daoGetListFromUserID = (userId) => {
    return dispatch => {
        dispatch (daoStart());

        axios.get(`/Persons/${userId}/daos`)
            .then((response) => {
                const filteredDAOs = response.data.filter( (dao) => {
                   return ( //removing daos who are not mined on blockchain to avoid to have user who try to send money to them
                       dao.state === 'confirmed' && ( parseInt(dao.address, 16) !== 0 )
                   );
                });
                logger.debug('daoGetListFromUserID => ', filteredDAOs);
                dispatch(daoGetFromUserSuccess(filteredDAOs));
            })
            .catch ((error) => {
                dispatch(daoGetFromUserFail(error));
            });
    }
};


//userId on mongo is a FirstLifePlaceId
export const daoGetDataFromId = (userId) => {
    //const currentProfile = JSON.parse(localStorage.getItem('currentProfile'));
    //const currentProfile = getState().user.currentProfile;

    return dispatch =>{
        dispatch(daoGetDelete());
        dispatch(daoGetStart());

        const firstPlaceId = userId;

        const params = { 
            params: {
                filter: {
                    where: {
                        'firstLifePlaceID': firstPlaceId
                    }    
                }
            }
        };

        const url = `DAOS`;

        axios.get(url, params)
            .then( (response) => {
                dispatch(daoGetSuccess(response.data[0]));
            })
            .catch( (error) => {
                dispatch(daoGetFail(error));
            });
        
    };
};
