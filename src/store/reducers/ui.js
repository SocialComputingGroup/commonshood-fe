import * as actionTypes from '../actions/actionTypes';

const initialState = {
    bottomMenuActiveIndex: 0,
};

const handleBottomMenuIndexChange = (state, action) =>{
    return {
        ...state,
        bottomMenuActiveIndex: action.index,
    }
};

const reducer = (state = initialState, action) => {
    switch(action.type){
        case actionTypes.UI_BOTTOM_MENU_INDEX_CHANGE: return handleBottomMenuIndexChange(state,action);
        default: return state;
    }
};

export default reducer;