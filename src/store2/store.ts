import {configureStore} from '@reduxjs/toolkit';

import coinReducer from './slices/coinSlice';
import crowdsaleReducer from './slices/crowdsaleSlice';
import web3Reducer from './slices/web3Slice';
import uiReducer from './slices/uiSlice';
import userReducer from './slices/userSlice';


const store = configureStore({
    reducer: {
        coin: coinReducer,
        crowdsale: crowdsaleReducer,
        web3: web3Reducer,
        ui: uiReducer,
        user: userReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>

export default store;