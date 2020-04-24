//
// Wallet Reducer for manage Wallet redux actions
//

//Importing action types
import * as actionTypes from '../actions/actionTypes';

//Utility for updating the state in a leaner way
import { updateObject} from '../../utilities/utilities';

const initialState = {
    places: null,
    loading: false,
    error: null, 
    daos: null
};

const placeStart = (state, action) => {
    return updateObject(state, { loading: true })
};

const placeGet = (state, action) => {
    const newPlaces = action.places; 
    return updateObject(state, { places: newPlaces, loading: false, error: false });
};

const placeReset = (state, action) => {
    return updateObject(state, {places: null,loading: false,error: null});
};

const placeError = (state, action) => {
    const error = action.error;
    return updateObject(state, { loading: false, error: error});
};

const daosGet = (state, action) => {
    const newDaos = action.daos;
    return updateObject(state, {daos: newDaos});
};

const reducer = (state=initialState, action) => {
    switch (action.type) {
        case actionTypes.PLACE_GET: return placeGet(state,action);
        case actionTypes.PLACE_START: return placeStart(state,action);
        case actionTypes.PLACE_RESET: return placeReset(state,action);
        case actionTypes.PLACE_FAIL: return placeError(state,action);
        case actionTypes.DAOS_GET: return daosGet(state,action);
        default: return state;
    }
};

export default reducer;