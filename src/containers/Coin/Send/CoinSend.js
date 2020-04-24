import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {geolocated} from 'react-geolocated';

import {withTranslation} from "react-i18next";

//winston logger
import {logger} from '../../../utilities/winstonLogging/winstonInit';

//Redux connector
import { connect } from 'react-redux';
import * as actions from "../../../store/actions";

//lorem ipsum text generator
//const lorem = asyncComponent(()=>import('lorem-ipsum'));

//Async code splitting
import asyncComponent from '../../../hoc/AsyncComponent/AsyncComponent';
//import coordinatesComponent from '../../../hoc/CoordinatesComponent/CoordinateComponents';

//Material UI Components
// const Divider = asyncComponent(()=>import('@material-ui/core/Divider')) ;
// const CircularProgress = asyncComponent(()=>import('@material-ui/core/CircularProgress'));
// const Slide = asyncComponent(()=>import("@material-ui/core/Slide")) ;
import Divider from '@material-ui/core/Divider';

import config from './configSend';

//Utilities
import {
    listIntoArray,
    alphabeticComparisonObj,
    arrayComparison,
    calculateDistance,
    isProfileChanged
} from '../../../utilities/utilities';

//Place placeholder
import place_placeholder from "../../../assets/img/home-green.png";
import {Typography} from "@material-ui/core";

import changeCase from 'change-case';

import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import MiniLoader from "../../../components/UI/Loading/MiniLoader";
import MApIcon from '@material-ui/icons/ZoomOutMap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Explore from '@material-ui/icons/Explore';
import MapComponent from '../../../components/Map/Map'
import {fromLonLat} from 'ol/proj.js';
import CoinSendForm from './CoinSendForm/CoinSendForm';

//Custom Components
const ContactList = asyncComponent(()=>import("../../../components/Contacts/ContactList/ContactList"));
const SlideModal = asyncComponent(()=>import('../../../components/UI/Modal/SlideModal/SlideModal'));
const SearchField = asyncComponent(()=>import('../../../components/UI/Input/Text/SearchField/SearchField'));
const Avatar = asyncComponent(()=> import("@material-ui/core/Avatar"));


// String comparison functions
// Alphabetic order
const alphabetic_users = (a,b) => {
    return alphabeticComparisonObj(a,b,'name');
};

class CoinSend extends Component {


    state = {
        contactModalOpened: false,
        sendFormOpened: false,
        selectedContact: null,
        localContactList: [],
        localPlacesList: [],
        searchInput: null,
        sortKey: 0,
        filterKey: '*',
        shortDistance: config.shortDistance,
        longDistance: config.distance,
        notificationLoaded: false,
        mapModalOpened: false,
        placeLocation: null,
        searchStartTimeout: null,
    };


    placeBuild = (place, coords) => {
        return {
            id: place.id,
            firstLifePlaceID: place.firstLifePlaceID,
            realm: place.realm, //aka dao, see place.js
            name: `${place.FLName}`,//`${place.name} - ${place.FLName}`,
            //FLName: place.FLName,
            verified: true,
            near: true,
            icon: place_placeholder,
            description: place.description,
            category: place.entity_type,
            coordinates: {
                latitude:  place.coordinates[1],
                longitude: place.coordinates[0]
            },
            distance: calculateDistance( 
                coords.latitude,
                coords.longitude,
                place.coordinates[1],
                place.coordinates[0])
        }
    };

    //Open Send Form
    sendFormOpen = (contact) =>{
        this.setState({
            selectedContact: contact,
            sendFormOpened: true
        });
    };

    //Close Send Form
    sendFormClose = () => {

        this.setState({
            selectedContact: null,
            sendFormOpened: false
        });

        this.updateSearchInput('');
        this.props.onCoinSentReset();
        this.props.onCoinUnsetPreselected();
        this.props.removePreselectedContact();
    };

    extractTopUserList = (notifications,limit) => {
        const counts = new Map();
        notifications.forEach((item, index) => {
            const tmp =
                item.userId === item.body.message.params.sender.id
                ? item.body.message.params.receiver.id
                : item.body.message.params.sender.id;
            counts.set(tmp, (counts.get(tmp) || 0) + 1);
        });
        const mapSort = new Map([...counts.entries()].sort((a, b) => b[1] - a[1]));
        let userIds = [...mapSort.keys()];

        return userIds.slice(0,limit);
    };

    //Updates Search Input and triggers api search
    updateSearchInput = (inputField, force) => {
        const {
            localContactList,
            localPlacesList,
            shortDistance,
            longDistance,
            searchStartTimeout
        } = this.state;
        const {
            //onPlacesGetList,
            onUserGetList,
            onUserDeleteList,
            //onPlacesDeleteList,
            onUserGetListByIds,
            userLoading,
            //placeLoading,
            coords,
            notificationsList
        } = this.props;

        /* Note that initially inputField is set at null in the state
         *  In componentDidMount we call this function for the very first time with inputField param == ''
         *  So we correctly initialize most frequent contacts and closest daos
         */
        if( (inputField !== this.state.searchInput) || force){ //we have a new input
            //cleanup of previous timeout if exist, no need to check for null for clearTimeout
            clearTimeout(searchStartTimeout); 

            //creating new timeout
            const timeout = setTimeout( () => {
                if (inputField.length > 0) { //do api search if the inputField is populated
                    if (localContactList) {
                        onUserDeleteList();
                        this.setState({localContactList: []});
                    }
                    if (/*localContactList.length === 0 &&*/ !userLoading) {
                        onUserGetList(inputField);
                    }
                    // if (!placeLoading) {
                    //     // Check if coordinates are available    
                    //     if (coords) {
                    //         onPlacesGetList(coords.latitude, coords.longitude, longDistance, inputField);
                    //     }
                    // }
                }

                if (inputField.length === 0) { //show default contacts if inputField is empty
                    if (localContactList) {
                        onUserDeleteList();
                        this.setState({localContactList: []});
                    }
                    // if(notificationsList.length > 0) {
                    //     this.setState({notificationLoaded: true});
                    //     let userIds = this.extractTopUserList(notificationsList, config.numberOfTopUsersToShow);
                    //     onUserGetListByIds(userIds);
                    // }
                    // if (localPlacesList) {
                    //     onPlacesDeleteList();
                    //     this.setState({localPlacesList: []});
                    //     if (coords) {
                    //         onPlacesGetList(coords.latitude, coords.longitude, shortDistance, '')
                    //     }
                    // }
                }

            }, 1000);  //run search after 1 second
            
            this.setState({
                searchInput: inputField,
                searchStartTimeout: timeout
            });
            
        }
    };

    mapModalCloseHandler = () => {
        this.setState({mapModalOpened: false})
        this.setState({placeLocation: null})
    };

    mapModalOpenHandler = () => this.setState({mapModalOpened: true});

    handlePay = (contact) => {
        this.props.preselectContact(contact);
        this.mapModalCloseHandler();
    };

    handleLocatePlace = (location) => {
        this.setState({placeLocation: fromLonLat([location.longitude,location.latitude])});
        this.mapModalOpenHandler();
    };

    componentDidMount() {
        this.props.onNotificationsGetList( localStorage.getItem('userId') );
        // this.props.onDaosGetList();
        this.updateSearchInput(''); //to initialize default places
    }

    componentDidUpdate (prevProps, prevState, snapshot) {
        logger.info("[COIN SEND] - DID UPDATE");
        logger.debug('[COIN SEND] prevProps =>', prevProps);

        const {
            //placeLoading,
            //placesList,
            //placeError,
            coords,
            userLoading,
            userList,
            profile,
            notificationsList,
            preselectedContact,
            notificationLoading
        } = this.props;

        const previousPlacesList = prevProps.placesList;

        const {
            localContactList,
            searchInput,
            notificationLoaded,
            sendFormOpened
        } = this.state;

        if(preselectedContact && (sendFormOpened === false) ){
            this.setState({sendFormOpened: true});
        }

        // if (coords) {
        //     if ( !placeLoading && !placesList && !placeError ){
        //         this.updateSearchInput(searchInput);
        //     }
        // }

        if(notificationsList.length > 0 
            && !notificationLoading 
            && (prevProps.notificationsList.length !== notificationsList.length)
        ) {
            this.updateSearchInput(searchInput, true);
        }

        if( (prevProps.profile != null) && (profile != null) && isProfileChanged(prevProps.profile, profile)){
            logger.info('[PROFILE HAS CHANGED]');
            //reset searchbar
            // this.setState({
            //     searchInput: ''
            // });
            this.updateSearchInput(this.state.searchInput);
        }

        //Update local state list
        if (
            localContactList.length === 0 &&
            !userLoading &&
            userList &&
            userList.length !== 0
            ) {
                logger.debug('[COIN SEND] updated local contact list');
                this.setState ({
                    localContactList: userList.slice().sort(alphabetic_users),
                });
        }

        //Update local places list
        // if (
        //     !placeLoading &&
        //     placesList &&
        //     placesList.length !== 0 &&
        //     !arrayComparison(placesList, previousPlacesList)
        //     ) {
        //         logger.debug('[COIN SEND] updated local places list');
        //         this.setState( {localPlacesList: listIntoArray(placesList)} )
        // }
    }

    componentWillUnmount() {
        // this.props.onPlacesDeleteList();
        this.props.onUserDeleteList();

        this.props.onCoinUnsetPreselected();
    }

    render() {
        const {
            selectedContact,
            sendFormOpened,
            searchInput,
            localContactList,
            localPlacesList,
            mapModalOpened,
            placeLocation
        } = this.state;


        const {
            t, //i18n from HOC
            coords,
            userLoading,
            placeLoading,
            preselectedCoin,
            profile,
            daos,
            preselectedContact, //got from redux, if != null some other component already preselected a contact for us
        } = this.props;
        logger.debug("[COIN SEND] coordinates => ", coords);

        let currentLocation = null;
        if(coords) {
            currentLocation = fromLonLat([coords.longitude,coords.latitude])
        }

        let listRender = null;

        
        if ((coords && placeLoading) || userLoading) {
            listRender = (<MiniLoader t={t} />);
        }

        if (!userLoading && !placeLoading) {
            listRender = (<Typography variant="subtitle1">{t('searchSubtitle') + "..."}</Typography> );
        }

        //Concatenated list of contacts and places
        let globalList = [];


        if(localPlacesList.length !== 0)
        {
            logger.debug('[COIN SEND] local places list => ', localPlacesList);
            globalList = localPlacesList.map(place => this.placeBuild(place,coords)).sort(function(a, b){return a.distance-b.distance});
        }

        if (localContactList.length !== 0) {
            logger.debug('[COIN SEND] local contact list => ', localContactList);
            globalList = globalList.concat(localContactList);
        }

        logger.debug('[COIN SEND] global list => ', globalList);

        if (globalList.length !== 0) {
            listRender = (
                <>
                    <ContactList
                        searchInput={searchInput}
                        placeList={localPlacesList.map(place => this.placeBuild(place,coords)).sort(function(a, b){return a.distance-b.distance})}
                        contactList={localContactList}
                        currentProfile={profile}
                        locatePLace={(location) => this.handleLocatePlace(location)}
                        hasSearched={ this.state.searchInput.length > 0 }
                        handleSelect={(contact)=> this.sendFormOpen(contact)}
                        style={{display: 'flex', maxWidth:'100%'}}
                    />
                </>
            );
        }

        //preselected coin? (Someone clicked pay on CoinDetails from wallet)
        let preselectedCoinComponent = null;
        if(preselectedCoin){
            preselectedCoinComponent = (
                <Grid container alignItems="center" justify="center">
                    <Grid item xs={12} style={{flexBasis: 'auto'}}>
                        <Typography align='center' componet="p">
                            {t('preselectedCoinText')}
                                <Avatar src={preselectedCoin.icon} style={{display: 'inline-block'}}/>
                                <strong>{preselectedCoin.ticker}</strong>
                                &nbsp;{t('to')}:
                        </Typography>
                    </Grid>
                </Grid>
            );
        }

        // modal which opens the coinSendForm inside itself
        let sendFormModal = null;
        if(preselectedContact != null){ //contact selected by another external component
            // logger.warn("PRESELECTEDCONTACT TRUE");
            sendFormModal = (
                <SlideModal
                    open={sendFormOpened}
                    handleClose={this.sendFormClose}
                    title={changeCase.upperCaseFirst( (t('pay')) ) + " " + preselectedContact.name}
                    icon={preselectedContact.icon}
                >

                    <CoinSendForm
                        contact={preselectedContact}
                        //preselectedCoin={preselectedCoin}
                    />

                </SlideModal>
            )
        }
        if(selectedContact != null){ //contact selected by clicking over a contact element
            sendFormModal = (
                <SlideModal
                    open={sendFormOpened}
                    handleClose={this.sendFormClose}
                    title={changeCase.upperCaseFirst( (t('pay')) ) + " " + selectedContact.name}
                    icon={selectedContact.icon}
                >

                    <CoinSendForm
                        contact={selectedContact}
                        preselectedCoin={preselectedCoin}
                        handleClose={() => this.sendFormClose()}/>

                </SlideModal>
            );
        }


        return (
            <>
                {preselectedCoinComponent}
                <Grid container>
                    {/* <Grid item xs={10} sm={11}> */}
                    <Grid item xs={12} >
                        <SearchField
                            placeholder={changeCase.titleCase( t('searchContacts') )}
                            searchHandler={(event)=>this.updateSearchInput(event.target.value)}
                            value={searchInput}
                        />
                    </Grid>
                    {/* <Grid item xs={2} sm={1} align="center">
                        <IconButton 
                            disabled={ (daos === null) || (coords === null)} 
                            color="primary" 
                            size="small" 
                            onClick={this.mapModalOpenHandler} 
                            style={{padding: 0, margin: "24px 0px 0px 12px"}}>
                            <Explore/>
                        </IconButton>
                    </Grid> */}
                </Grid>
                {listRender}
                {sendFormModal}
                <SlideModal
                            open={mapModalOpened}
                            handleClose={this.mapModalCloseHandler}
                            title="Mappa"
                            position= "absolute"
                        >
                        <div style={{marginTop: 60,width: "100%",height: "100%"}}>
                            <MapComponent currentLocation={currentLocation} entities = {daos} pay = {(contact) => this.handlePay(contact)} placeToCenter={placeLocation} type="FL_PLACES"/>
                        </div>  
                </SlideModal>
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        placeLoading: state.place.loading,
        placesList: state.place.places,
        placeError: state.place.error,
        userLoading: state.user.loading,
        userList: state.user.userList,
        profile: state.user.currentProfile,
        coinLoading: state.coin.loading,
        preselectedCoin: state.coin.preselectedCoin,
        notificationLoading: state.notification.loadingNotificationsFiltered,
        notificationsList: state.notification.notificationsFiltered,
        daos: state.place.daos,
        preselectedContact: state.user.preselectedContact,
    }
};


const mapDispatchToProps = dispatch => {
    return {
        //onPlacesGetList: (lat,lon,distance,name) => dispatch(actions.placeGetPlaces(lat,lon,distance,name)),
        //onPlacesDeleteList: () => dispatch(actions.placeReset()),
        onUserGetList: (name) => dispatch(actions.userGetListData(name)),
        onUserGetListByIds: (userIds) => dispatch(actions.userGetListByids(userIds)),
        onUserDeleteList: () => dispatch(actions.userDelete()),
        onCoinSentReset: () => dispatch (actions.coinSendReset()),
        onCoinUnsetPreselected: () => dispatch(actions.coinUnsetPreselected()),
        onNotificationsGetList: (userId) => dispatch(actions.notificationGetAllMyCoinSentOrReceived()),
        //onDaosGetList: () => dispatch(actions.placesGetDaos()),
        removePreselectedContact: () => dispatch(actions.userRemovePreselectedContact()),
        preselectContact: (contact) => dispatch(actions.userPreselectContact(contact)),
    }
};

CoinSend.propTypes = {};

export default withRouter(
                    withTranslation('Common') (
                        geolocated({
                                positionOptions: {
                                enableHighAccuracy: true,
                            },
                            userDecisionTimeout: 5000,
                        }) ( connect(mapStateToProps,mapDispatchToProps) (CoinSend) )
                    )
                );
