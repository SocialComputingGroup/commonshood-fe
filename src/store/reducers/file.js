// File Reducer for coin management actions

//Importing action types
import * as actionTypes from '../actions/actionTypes';

//Utility for updating the state in a leaner way
import { updateObject } from '../../utilities/utilities';

const initialState = {
    error: null,
    loading: false,
    fileData: null,
    fileDataURL: null,
    fileList: null
};

//File Upload reducers
const fileUploadStart = (state, action) => {
    return updateObject(state, {
        error: null,
        fileData: null,
        loading: true
    });
};

const fileUploadSuccess = (state, action) => {
    return updateObject(state, {
        fileData: action.fileData,
        loading: false
    });
};

const fileUploadFail = (state, action) => {
    return updateObject(state,{
        error: action.error,
        loading: false
    });
};
const fileGetStart = (state, action) => {
    return updateObject(state, {
        error: null,
        fileData: null,
        loading: true
    });
};

const fileGetSuccess = (state, action) => {
    return updateObject(state, {
        error: null,
        fileData: action.fileData,
        loading: false
    });
};

const fileGetFail = (state, action) => {
    return updateObject(state,{
        error: action.error,
        loading: false,
        fileData: null,
    });
};

const fileGetReset = (state, action) => {
    return updateObject(state,{
        error: null,
        loading: false,
        fileData: null
    });
};

const fileGetListStart = (state, action) => {
    return updateObject(state, {
        error: null,
        fileList: null,
        loading: true
    });
};

const fileGetListSuccess = (state, action) => {
    return updateObject(state, {
        error: null,
        fileList: action.fileList,
        loading: false
    });
};

const fileGetListFail = (state, action) => {
    return updateObject(state,{
        error: action.error,
        loading: false,
        fileList: null,
    });
};

const fileGetListReset = (state, action) => {
    return updateObject(state,{
        error: null,
        loading: false,
        fileList: null
    });
};




const reducer = (state = initialState, action) => {

    switch (action.type) {
        case actionTypes.FILE_UPLOAD_START: return fileUploadStart(state,action);
        case actionTypes.FILE_UPLOAD_SUCCESS: return fileUploadSuccess(state,action);
        case actionTypes.FILE_UPLOAD_FAIL: return fileUploadFail(state,action);
        case actionTypes.FILE_GET_START: return fileGetStart(state,action);
        case actionTypes.FILE_GET_SUCCESS: return fileGetSuccess(state,action);
        case actionTypes.FILE_GET_FAIL: return fileGetFail(state,action);
        case actionTypes.FILE_GET_RESET: return fileGetReset(state,action);
        case actionTypes.FILE_GET_LIST_START: return fileGetListStart(state,action);
        case actionTypes.FILE_GET_LIST_SUCCESS: return fileGetListSuccess(state,action);
        case actionTypes.FILE_GET_LIST_FAIL: return fileGetListFail(state,action);
        case actionTypes.FILE_GET_LIST_RESET: return fileGetListReset(state,action);
        default: return state;
    }
};

export default reducer;
