// Main Routes
//import React from 'react';

//Async loading
import asyncComponent from '../hoc/AsyncComponent/AsyncComponent'

// Views loaded asynchronously

const AsyncMain = asyncComponent(()=> import ('../views/Main/Main'));
const AsyncMessages = asyncComponent(() => import ('../views/Messages/Messages'));
const AsyncCoinCreateForm = asyncComponent(()=> import ('../containers/Coin/CoinCreateForm/NewCoinCreateForm'));
const AsyncCrowdSaleCreateForm = asyncComponent(()=> import ('../containers/CrowdSale/CrowdSaleCreateForm/CrowdSaleCreateForm'));
const AsyncQrPage = asyncComponent( () => import ('../components/Qr/Qr'));
const Logout = asyncComponent(()=> import ('../containers/Auth/Logout/Logout'));
const AsyncAbout = asyncComponent(() => import ('../views/About/About'));

//import Auth from "../containers/Auth/Auth";

const indexRoutes = [
    // { path: "/login", name: "Login", component: Auth, private: false, exact: false },
    { path: "/coinCreate", name:"Create Your Coin", component: AsyncCoinCreateForm, private: true, exact: false },
    { path: "/crowdSaleCreate", name:"Create Crowdsale", component: AsyncCrowdSaleCreateForm, private: true, exact: false },
    { path: "/messages", name: "Messages", component: AsyncMessages, private: true, exact: false},
    { path: "/qrcode", name: "QrCode", component: AsyncQrPage, private: true, exact: false},
    { path: "/about", name: "About", component: AsyncAbout, private: true, exact: false},
    { path: "/logout", name: "Logout", component: Logout, private:true , exact: false },
    //Main Root
    { path: "/", name: "Home", component: AsyncMain, private: true, exact: true },
    ];

export default indexRoutes;
