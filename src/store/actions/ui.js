import * as actionTypes from './actionTypes';

export const handleBottomMenuIndexChange = ( index ) => {
    return {
        type: actionTypes.UI_BOTTOM_MENU_INDEX_CHANGE,
        index
    }
};