import {createSlice, PayloadAction} from "@reduxjs/toolkit";

type UIinitialState = {
    bottomMenuActiveIndex: number
}
const initialState: UIinitialState = {
    bottomMenuActiveIndex: 0,
};

export const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        handleBottomMenuIndexChange(state, action: PayloadAction<{ index: number }>) {
            state.bottomMenuActiveIndex = action.payload.index;
        }
    }
})

export const {handleBottomMenuIndexChange} = uiSlice.actions;