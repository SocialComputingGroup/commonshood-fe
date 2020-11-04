import React from 'react';
import ReactDOM from 'react-dom';

import {loadToken} from "./utilities/backend/axios-strongloop";

// Redux
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';

//React router
import { BrowserRouter } from 'react-router-dom';

//Reducers
import authReducer from './store/reducers/auth';
import userReducer from './store/reducers/user';
import walletReducer from './store/reducers/wallet';
import coinReducer from './store/reducers/coin';
import fileReducer from './store/reducers/file';
import placeReducer from './store/reducers/place';
import daoReducer from './store/reducers/dao';
import crowdsaleReducer from './store/reducers/crowdsale';
import notificationReducer from './store/reducers/notification';
import uiReducer from './store/reducers/ui';
import web3Reducer from './store/reducers/web3';

//i18n - note this is all that's needed to use i18n in the whole app, no HOC, just magic
import './i18n';

//Fonts and icons
import WebFont from 'webfontloader';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';

// Main App
// import './index.css';
import App from './App';

// Main Config
import config from './config';

//Main MuiTheme
import {ThemeProvider as MuiThemeProvider} from '@material-ui/core/styles';
import theme from './theme/theme'

//Date utilities for datepickers
import { MuiPickersUtilsProvider } from 'material-ui-pickers';
import DateFnsUtils from '@date-io/date-fns';

//Snackbar Provider
import { SnackbarProvider } from 'notistack';

// Load Material Fonts and FA icons
WebFont.load({
    google: {
        families: [
            'Roboto:300,500,700',
            'Roboto+Slab:400,700',
            'Material Icons'
         ]
    }
});

library.add(fab, far, fas);

// Reducers composition
//Redux Dev tools connector
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

//Redux store creation with thunk middleware
const rootReducer = combineReducers({
    auth: authReducer,
    user: userReducer,
    wallet: walletReducer,
    coin: coinReducer,
    file: fileReducer,
    place: placeReducer,
    dao: daoReducer,
    crowdsale: crowdsaleReducer,
    notification: notificationReducer,
    ui: uiReducer,
    web3: web3Reducer,
});


// Redux Store creation (with thunk async middleware)
const store = createStore(rootReducer, composeEnhancers(
    applyMiddleware(thunk)
));

loadToken();

//Main App MuiTheme

const app=(
    <Provider store={store}>
        <BrowserRouter>
            <MuiThemeProvider theme={theme}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <SnackbarProvider
                        maxSnack={config.interface.snackbar.maxSnack}
                        transitionDuration={config.interface.snackbar.transitionDuration}
                    >
                        {/* <Suspense fallback={<Loading withLoader />}> */}
                            <App/>
                        {/* </Suspense> */}
                    </SnackbarProvider>
                </MuiPickersUtilsProvider>
            </MuiThemeProvider>
        </BrowserRouter>
    </Provider>
);

ReactDOM.render(app, document.getElementById('root'));
//registerServiceWorker();
