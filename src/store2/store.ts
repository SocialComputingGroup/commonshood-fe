import {configureStore} from '@reduxjs/toolkit';

import coinReducer from './slices/coinSlice';

const store = configureStore({
    reducer: {
        coin: coinReducer,
    },
});

export default store;