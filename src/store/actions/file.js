//
// Redux Authentication Action dispatchers for FILES
//

//Import axios HOC for REST Call to strongloop
import axios from '../../utilities/backend/axios-strongloop'
//import axios_helper from 'axios';

import * as actionTypes from "./actionTypes";

//Sync Actions

//File Upload
export const fileUploadStart = () => {
    return {
        type: actionTypes.FILE_UPLOAD_START
    }
};

export const fileUploadSuccess = (fileHash) => {
    return {
        type: actionTypes.FILE_UPLOAD_SUCCESS,
        fileHash: fileHash
    }
};

export const fileUploadFail = (error) => {
    return {
        type: actionTypes.FILE_UPLOAD_FAIL,
        error: error
    }
};

export const fileGetStart = () => {
    return {
        type: actionTypes.FILE_GET_START
    }
};

export const fileGetSuccess = (fileData) => {
    return {
        type: actionTypes.FILE_GET_SUCCESS,
        fileData: fileData
    }
};

export const fileGetFail = (error) => {
    return {
        type: actionTypes.FILE_GET_FAIL,
        error: error
    }
};

export const fileGetReset = () => {
    return {
        type: actionTypes.FILE_GET_RESET
    }
};

export const fileGetListStart = () => {
    return {
        type: actionTypes.FILE_GET_LIST_START
    }
};

export const fileGetListSuccess = (fileList) => {
    return {
        type: actionTypes.FILE_GET_LIST_SUCCESS,
        fileList: fileList
    }
};

export const fileGetListFail = (error) => {
    return {
        type: actionTypes.FILE_GET_LIST_FAIL,
        error: error
    }
};

export const fileGetListReset = () => {
    return {
        type: actionTypes.FILE_GET_LIST_RESET
    }
};

//Async Actions

//Upload new file
export const fileUpload = (file) => {
    return dispatch => {

        dispatch(fileUploadStart());
        axios.post('/Resources/upload', file)
            .then((response) => {
                dispatch(fileUploadSuccess(response.data))
            })
            .catch((error) => dispatch(fileUploadFail(error)))
    }
};

export const fileGetData = (fileHash) => {
    return dispatch => {
        if(fileHash == null){
            return dispatch(fileGetFail(new Error('given fileHash was undefined')));
        }

        dispatch(fileGetReset());
        dispatch(fileGetStart());
        axios.get ('/Resources/get/'+fileHash )
            .then ((response) => {
                dispatch(fileGetSuccess(response.data.file))
            })
            .catch((error) => {
                dispatch (fileGetFail(error))
            })
    }
};

const fileGetDataWithPromise = (fileHash) => {
    return new Promise ((resolve,reject) => {
        axios.get ('/Resources/get/'+fileHash )
            .then ((response) => {
                resolve(response.data.file)
            })
            .catch((error) => {
                resolve('');
            })
    })
}

export const fileGetList = (hashArray) => {
    return dispatch => {
        dispatch(fileGetListReset());
        dispatch(fileGetListStart());

        let hashArrayPromise = hashArray.map ((hash,index) => {
            return fileGetDataWithPromise(hash)
                .then(resolve => {
                    return {hash: hash, body: resolve.body}} )
                .catch(error => error)
        });

        Promise.all(hashArrayPromise)
            .then(resolve => {
                dispatch(fileGetListSuccess(resolve))})
            .catch(error => dispatch(fileGetListFail(error)))
    }
}


