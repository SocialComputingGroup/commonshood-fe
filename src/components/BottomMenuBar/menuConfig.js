import React from 'react';

import {constantCase} from 'change-case';


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
            text: constantCase( t('pay'), {delimiter: " "} ),
            path: '/pay',
        },
        'pigs': {
            icon: <HowToVote />,
            text: constantCase(t('piggies'), {delimiter: " "} ),
            path: '/pigs',
        },
        'coins': { //coin balance view
            //icon: {font: 'material', name: 'payment'},
            icon: <Payment/>,
            text: constantCase( t('myWallet'), {delimiter: " "} ),
            path: '/coins',
        },

    };


};
