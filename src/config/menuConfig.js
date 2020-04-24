import React from 'react';

//Menu Icons
import Home from '@material-ui/icons/Home';
//import AttachMoney from '@material-ui/icons/AttachMoney';
import ExitToApp from '@material-ui/icons/ExitToApp';
import HowToVote from "@material-ui/icons/HowToVote";
import Info from '@material-ui/icons/Info';
import Notifications from '@material-ui/icons/Notifications';
//import SelectAll from '@material-ui/icons/SelectAll';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCoins} from "@fortawesome/free-solid-svg-icons/faCoins";

import Icon from "@material-ui/core/Icon";


//MaterialDesignIcons
// import Pig from 'mdi-material-ui/Pig'

const menuConfig = (t) => {

    return {
        menu: {
            title: 'CommonsHood Menu',
            items: {
                'home': {
                    //icon: {font: 'material', name:'home'},
                    icon: <Home/>,
                    text: t('Menu:home'),
                    path: '/'
                },
                'create_coin': {
                    //icon: {font: 'material', name:'attach_money'},
                    icon: <Icon style={{height: '1.5em'}}><FontAwesomeIcon icon={faCoins}/></Icon>,
                    text: t('Menu:createCoin'),
                    path: '/coinCreate',
                    concurrent: true,
                },
                // 'create_crowdsale': {
                //     //icon: {font: 'mdi', name:'pig'},
                //     icon: <HowToVote />,//<Pig/>,
                //     text: t('Menu:createCrowdsale'),
                //     path: '/crowdSaleCreate',
                //     concurrent: true,
                // },
                // 'messages': {
                //     icon: <Notifications />,
                //     text: t('Menu:messages'),
                //     path: '/messages'
                // },
                // 'qrCode': {
                //     icon: <SelectAll />,
                //     text: t('Menu:qrcode'),
                //     path: '/qrcode',
                // },
                'about' : {
                    icon: <Info/>,
                    text: t('Menu:about'),
                    path: '/about'
                },
                'logout': {
                    //icon: {font: 'material', name:'exit_to_app'},
                    icon: <ExitToApp/>,
                    text: t('Menu:logout'),
                    path: '/logout'
                }


            }
        }
    };

};


export default menuConfig;
