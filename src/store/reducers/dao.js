//
// DAO Reducer
//

//Importing action types
import * as actionTypes from '../actions/actionTypes';

//Utility for updating the state in a leaner way
import { updateObject } from '../../utilities/utilities';

const initialState = {
    error: null,
    loading: false,
    daoList: [],
    currentDao: null,
    currentDaoIsFound: null,
};

const daoStart = (state,action) => {
    return updateObject( state, { error: null, loading: true } );
};

const daoGetListSuccess = (state,action) => {
    return updateObject( state, {daoList: action.daoList, loading: false});
};

const daoGetListFail = (state,action) => {
    return updateObject( state, {error: action.error, loading: false});
};

const daoReset = (state,action) => {
    return updateObject( state, {error: null, loading: false, daoList: []});
};

// VVV reducers for single dao retrive
const daoGetDelete = (state, action) => {
    return updateObject( state, {currentDao: null, currentDaoIsFound: null});
};

const daoGetStart = (state, action) => {
    return updateObject( state, {error: null, loading: true});
};

const daoGetSuccess = (state, action) =>{
    return updateObject( state, {loading: false, currentDao: action.dao, currentDaoIsFound: true, });
};

const daoGetFail = (state, action) => {
    return updateObject(state, {loading: false, error: action.error, currentDaoIsFound: false});
};

//Reducer switcher
const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.DAO_START: 
            return daoStart(state,action);
        case actionTypes.DAO_GET_LIST_SUCCESS: 
            return daoGetListSuccess(state,action);
        case actionTypes.DAO_GET_LIST_FAIL: 
            return daoGetListFail(state,action);
        case actionTypes.DAO_RESET: 
            return daoReset(state, action);
        case actionTypes.DAO_GET_DELETE:
            return daoGetDelete(state, action);
        case actionTypes.DAO_GET_START:
            return daoGetStart(state, action);
        case actionTypes.DAO_GET_SUCCESS:
            return daoGetSuccess(state, action);
        case actionTypes.DAO_GET_FAIL:
            return daoGetFail(state, action);
        default: return state;
    }
};

export default reducer;