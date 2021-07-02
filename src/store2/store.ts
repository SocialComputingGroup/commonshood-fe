import {configureStore} from '@reduxjs/toolkit';

import coinReducer from './slices/coinSlice';
import crowdsaleReducer from './slices/crowdsaleSlice';

const store = configureStore({
    reducer: {
        coin: coinReducer,
        crowdsale: crowdsaleReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>

export default store;