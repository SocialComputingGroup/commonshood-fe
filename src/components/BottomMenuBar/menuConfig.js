import React from 'react';
import asyncComponent from '../../hoc/AsyncComponent/AsyncComponent';

import changeCase from 'change-case';


//Menu Icons
import Payment from '@material-ui/icons/Payment';
import Place from '@material-ui/icons/Place';
import HowToVote from '@material-ui/icons/HowToVote';
//const Pig = asyncComponent(()=>import('mdi-material-ui/Pig'));




export const getMenuElements = (t) => {

    return {
        'pay': { //payment view
            //icon: {font: 'material', name: 'place'},
            icon: <Place/>,
            text: changeCase.upperCase( t('pay') ),
            path: '/pay',
        },
        // 'pigs': {
        //     icon: <HowToVote />,
        //     text: changeCase.upperCase(t('piggies')),
        //     path: '/pigs',
        // },
        'coins': { //coin balance view
            //icon: {font: 'material', name: 'payment'},
            icon: <Payment/>,
            text: changeCase.upperCase( t('myWallet') ),
            path: '/coins',
        },

    };


};
