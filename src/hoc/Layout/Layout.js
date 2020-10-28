import React, { Component } from 'react';
//routing
import { withRouter } from 'react-router-dom';
//i18n
import { withTranslation } from "react-i18next";

import { logger } from '../../utilities/winstonLogging/winstonInit';

//Redux connector
import { connect } from 'react-redux';
import * as actions from "../../store/actions";

//Material-UI Components
import Grid from '@material-ui/core/Grid';
//import Typography from '@material-ui/core/Typography';
//import Avatar from '@material-ui/core/Avatar';
import Select from '@material-ui/core/Select';

//Snackbar provider
import { withSnackbar } from 'notistack';

//Notification message interpreter helper
import getNotificationText from '../../utilities/notification/notification-messages';

//Custom Components
import MainAppBar from '../../components/UI/NavBar/MainAppBar/MainAppBar';
import LanguageFlags from '../../components/UI/LanguageFlags/LanguageFlags';
import BottomMenuBar from "../../components/BottomMenuBar/BottomMenuBar";
import QrFab from '../../components/UI/QrFab/QrFab';
import ListMenu from "../../components/UI/Menu/ListMenu/ListMenu";
import Loading from "../../components/UI/Loading/Loading";
import ResponsiveDrawer from '../../components/UI/Drawer/ResponsiveDrawer';
import ContactSelectItem from '../../components/Contacts/ContactsSelect/ContactSelectItem/ContactSelectItem';

//Style injections
import { withStyles } from '@material-ui/core/styles';
import layoutStyle from './LayoutStyle'

//Menu Config
import menuConfig from '../../config/menuConfig';
import HelpModal from "../../views/Help/HelpModal/HelpModal";

import logo_cocity from "../../assets/img/logo_cocity.jpg";

import Avatar from '@material-ui/core/Avatar';
import Link from '@material-ui/core/Link';
import Divider from '@material-ui/core/Divider';

//Helper for profile comparison
import { isProfileChanged } from "../../utilities/utilities";

class Layout extends Component {

    state = {
        drawerOpen: false,
        notifyOpen: false,
        helpOpen: false,
        drawerVariant: null,
        anchorEl: null,
        navBarValue: 0,
        currentProfile: null,
        selectedProfile: 0,
    };

    constructor(props) {
        super(props);

        const {
            userLoading,
            daoLoading,
            onGetUserData,
            onGetWalletData,
            onGetDaoList,
        } = props;
        // Get user information from backend
        // When layout is mounting user is already authenticated, so userId should be instantiated
        const userId = localStorage.getItem('userId');
        if (!userLoading) {
            onGetUserData(userId);
            //onGetWalletData();
        }
        // if (!daoLoading) {
        //     onGetDaoList(userId);
        // }
    }

    navHandler = (path) => {
        this.drawerCloseHandler();
        setTimeout(() => this.props.history.push(path), 200);
    };

    // homeClickedHandler = () => {
    //     this.props.history.replace('/')
    // };

    // Drawer Handlers
    drawerOpenHandler = () => {
        this.setState({ drawerOpen: true })
    };

    drawerCloseHandler = () => this.setState({ drawerOpen: false });

    helpCloseHandler = () => this.setState({ helpOpen: false });


    componentDidMount() {
        //Pick props from redux store mapping
        const {
            storedProfile,
        } = this.props;

        //Pick State
        const {
            currentProfile
        } = this.state;

        // IF there is an already stored profile, it is put in current Profile store
        if (!currentProfile && storedProfile) {
            this.setState({ currentProfile: { ...storedProfile } });
        }

        //Verify help modal opening
        //const { helpOpen } = this.state;
        const queryUrlParams = new URLSearchParams(new URL(document.location).searchParams);
        if (queryUrlParams.has('help')) {
            this.setState({ helpOpen: true });
        }

    }

    componentDidUpdate(prevProps, prevState) {

        const {
            t, //i18n
            userLoading,
            //daoLoading,
            userData,
            //daoList,
            enqueueSnackbar,
            web3Listening,
            web3EventsList,
            walletData,
            walletLoading,
            storedProfile,
            onSetStoredProfile,
            onSetAllProfiles,
            notificationManager,
            profiles
        } = this.props;

        const {
            currentProfile,
        } = this.state;

        let newProfiles = [];
        if (!currentProfile &&
            !userLoading &&
            userData
        ) {
            //first load
            //const userObject = {...userData, coins: walletData.coins ? walletData.coins.slice() : null};
            const userObject = { ...userData };
            this.setState({ currentProfile: { ...userObject } });
        } else if (currentProfile && prevState.currentProfile && isProfileChanged(prevState.currentProfile, currentProfile)) {
            logger.debug("[CURRENT PROFILE CHANGED]", currentProfile);
            onSetStoredProfile(currentProfile);
        }

        //When component is updated, check if there is not a stored profile, if so, update current and stored profile
        if (!storedProfile &&
            !userLoading &&
            userData) {
            // const userObject = {...userData, coins: walletData.coins ? walletData.coins.slice() : null }

            // onSetStoredProfile(userObject);
            onSetStoredProfile(userData);
        }

        //populate PROFILES
        if (!profiles &&
            !userLoading &&
            userData //&&
            // !daoLoading &&
            // daoList
        ) {
            // const firstProfile = {...userData, coins: walletData.coins ? walletData.coins.slice() : null}
            // newProfiles.push(firstProfile);
            newProfiles.push({ ...userData });

            // if (daoList.length !== 0){
            //     daoList.forEach((item) => {
            //         newProfiles.push({
            //             id: item.firstLifePlaceID,
            //             name: item.name,
            //             realm: "dao",
            //             coins: item.coinsInWallet
            //         })
            //     })
            // }
            onSetAllProfiles(newProfiles.slice());
        }

        //Notification Updates
        if (web3Listening) {
            if (
                web3EventsList.length > prevProps.web3EventsList.length &&
                web3EventsList.length !== 0) {
                const msgItem = web3EventsList[0].body.message;
                const type = web3EventsList[0].type;
                notificationManager(web3EventsList[0]);
                const messageString = getNotificationText(msgItem.message_key, msgItem.params, type, t);

                enqueueSnackbar(messageString, { variant: web3EventsList[0].type })
            }
        }
    }

    render() {
        const {
            t, //i18n
            i18n,
            classes,
            theme,
            coinLoading,
            title,
            children,
            profiles,
            coords,
            isMetamaskChecking,
            web3Instance
        } = this.props;

        const {
            currentProfile,
            selectedProfile,
            helpOpen,
            drawerOpen,
            mapModalOpened
        } = this.state;

        let mainLayout = (
            <Grid container spacing={2}>
                <Grid item xs={12} className={classes.mainContainer}>
                    <Loading withLoader title={"Reaching Blockchain..."} />
                </Grid>
            </Grid>
        );

        if (profiles && profiles.length !== 0 && !isMetamaskChecking && web3Instance != null) {

            const mainMenu = (
                <React.Fragment>
                    <ListMenu
                        disableConcurrent={coinLoading}
                        navHandler={this.navHandler}
                    >
                        {menuConfig(t).menu.items}
                    </ListMenu>
                    <LanguageFlags i18n={i18n} />
                    <Divider />
                    <Link href="http://www.comune.torino.it/benicomuni/co-city/index.shtml" target="_blank">
                        <Avatar src={logo_cocity} className={classes.logo} />
                    </Link>
                </React.Fragment>
            );


            mainLayout = (

                <div className={classes.root} >
                    <MainAppBar
                        drawerHandler={this.drawerOpenHandler}
                        title={title}
                        profile={currentProfile}
                    />

                    <ResponsiveDrawer
                        mobileOpen={drawerOpen}
                        direction={theme.direction}
                        handleDrawerToggle={this.drawerCloseHandler}
                        userDataComponent={(
                            <Select
                                disabled={coinLoading}
                                style={{ width: "100%" }}
                                onChange={(event) => this.setState({
                                    currentProfile: profiles[event.target.value],
                                    selectedProfile: event.target.value
                                })}
                                value={selectedProfile}
                                renderValue={() => (<ContactSelectItem
                                    disabled={coinLoading}
                                    contact={currentProfile}
                                    value={selectedProfile} />
                                )}
                            >
                                {profiles.map((item, key) => {
                                    return <ContactSelectItem
                                        showEmail={true}
                                        contact={item}
                                        key={key}
                                        value={key}
                                    />
                                })}
                            </Select>
                        )}
                    >
                        {mainMenu}
                    </ResponsiveDrawer>

                    {/*Main Content*/}

                    <Grid container spacing={2} className={classes.content} >
                        <Grid item className={classes.gridItem} xs={12}>
                            {children}
                        </Grid>
                        <Grid container item xs={12}>
                            <Grid item>
                                <BottomMenuBar />
                            </Grid>
                        </Grid>
                    </Grid>

                    {/* HELP GUIDE */}
                    <HelpModal
                        open={helpOpen}
                        handleClose={this.helpCloseHandler}
                        tutorialSteps={[]}
                    />
                </div>
            );
        }


        return mainLayout;
    }
}

const mapStateToProps = state => {
    return {
        coinLoading: state.coin.loading,
        walletLoading: state.wallet.loading,
        userLoading: state.user.loading,
        userData: state.user.user,
        walletData: state.wallet.walletData,
        web3Listening: state.notification.notificationWeb3Listening,
        web3EventsList: state.notification.notificationsOfCurrentSession,
        //daoLoading: state.dao.loading,
        //daoList: state.dao.daoList,
        storedProfile: state.user.currentProfile,
        profiles: state.user.profilesList,
        isMetamaskChecking: state.web3.isMetamaskChecking,
        web3Instance: state.web3.web3Instance,
    }
};


const mapDispatchToProps = dispatch => {
    return {
        onGetUserData: (userId) => dispatch(actions.userGetDataFromId(userId)),
        //onGetDaoList: (userId) => dispatch(actions.daoGetListFromUserID(userId)),
        onGetWalletData: () => dispatch(actions.walletGetDataFromUser()),
        onSetStoredProfile: (data) => dispatch(actions.userSetCurrentProfile(data)),
        onSetAllProfiles: (profilesList) => dispatch(actions.userSetAllProfiles(profilesList)),
        onCrowdsaleUnlock: (crowdsaleID) => dispatch(actions.crowdsaleUnlock(crowdsaleID)),
        notificationManager: (notificationMessage) => dispatch(actions.notificationManager(notificationMessage)),
    }
};



Layout.propTypes = {};

// const mapSizesToProps = ({width} )=> {
//
//     return ({
//         window: width,
//     isMobile: width < 480,
//     isTablet: width < 840
// })};

export default connect(mapStateToProps, mapDispatchToProps)(
    withSnackbar(
        withRouter(
            withTranslation(['NotificationMessages', 'Menu', 'Common'])(
                withStyles(layoutStyle, { withTheme: true })(Layout)
            )
        )
    )
);
