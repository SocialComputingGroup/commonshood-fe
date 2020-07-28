import React, {Component} from 'react';
import {logger} from '../../../utilities/winstonLogging/winstonInit';

import config from '../../../config';

import Loading from '../../../components/UI/Loading/Loading';
import Slide from '@material-ui/core/Slide';
import PiggyCard from './PiggyCard/PiggyCard';
import PiggiesDetails from "./PiggiesDetails/PiggiesDetails";
import AlertAvatar from "../../../components/UI/AlertAvatar/AlertAvatar";
import SlideModal from "../../../components/UI/Modal/SlideModal/SlideModal";
import MapComponent from '../../../components/Map/Map'
import Button from "@material-ui/core/Button";
import Explore from '@material-ui/icons/Explore';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography'
import {geolocated} from 'react-geolocated';
import {fromLonLat} from 'ol/proj.js';

import {capitalCase} from 'change-case';




//Redux connector
import { connect } from 'react-redux';
import * as actions from "../../../store/actions";

//i18n
import {withTranslation} from "react-i18next";

import Grid from '@material-ui/core/Grid';

class Piggies extends Component {

    state = {
        crowdSaleModalOpened: false,
        selectedCrowdsale: null,
        mapModalOpened: false,

    };

    mapModalCloseHandler = () => this.setState({mapModalOpened: false});

    mapModalOpenHandler = () => this.setState({mapModalOpened: true});

    handleJoin = (crowdsale, crowdsales) => { 
        this.crowdSaleDetailOpen(crowdsales.find(element => element.firsLifePointId === crowdsale.firstLifePlaceID));
        this.mapModalCloseHandler();
    };

    componentDidMount() {
        const {
            onGetAllCrowdsales,
            onGetCoinList,
            onGetCoinListReset,
        } = this.props;

        onGetCoinListReset();
        onGetAllCrowdsales();
        onGetCoinList();
    }

    // Opens CrowdSale Detail
    crowdSaleDetailOpen = (crowdsale) => {
        this.setState({
            selectedCrowdsale: crowdsale,
            crowdSaleModalOpened: true
        });
    };

    //Close CrowdSale Detail
    crowdSaleDetailClose = () => {
        this.setState({
            selectedCrowdsale: null,
            crowdSaleModalOpened: false
        });
    };
  
    render() {
        const {
            t, //i18n translation
            crowdsales,
            coinList,
            coinListLoading,
            coords,
            crowdsalesLoading,
            userWalletAddress
        }= this.props;
        const currentProfileId = this.props.currentProfile.id;

        logger.debug('[PIGGIES.js] crowdsales =>', crowdsales);
        logger.info('[PIGGIES.js] crowdsales still loading =>', crowdsalesLoading);

        //managing case of still loading crowdsales (if any)
        if(crowdsalesLoading){
            return (
                <Loading title={t('loadingCrowdsales')} withLoader/>
            );
        }

        //managing case of no crowdsales
        if( !crowdsalesLoading && (crowdsales == null || crowdsales.length === 0) ){
            logger.info('No active crowdsales found right now');
            return (
                <Grid container alignItems="center" justify="center" direction="column">
                    <Grid item xs={12}>
                        <AlertAvatar big warning text={t('noCrowdsales')}/>
                    </Grid>
                </Grid>
            );
        }

        //standard case:
        let currentLocation = fromLonLat([
            config.defaultGeoCoordinates.longitude,
            config.defaultGeoCoordinates.latitude
        ]); //default on Turin
        if(coords) {
            currentLocation = fromLonLat([coords.longitude,coords.latitude]);
        }
        
        
        const extendedCrowdsales = crowdsales.map( crowdsale =>{
            const extendedCrowdsale = {...crowdsale};
            //images
            let tokenToAcceptLogo = null, tokenToGiveLogo = null;
            if( (coinList != null) && (coinList.length !== 0) && (!coinListLoading) ){
                const completeTokenToAccept = coinList.find( (elem) => elem.address === crowdsale.tokenToAcceptAddr );
                extendedCrowdsale.tokenToAcceptLogo = completeTokenToAccept ?  completeTokenToAccept.logoFile : null;
                const completeTokenToGive= coinList.find( (elem) => elem.address === crowdsale.tokenToGiveAddr );
                extendedCrowdsale.tokenToGiveLogo = completeTokenToGive ? completeTokenToGive.logoFile : null;
            }

            extendedCrowdsale.isOwnedByCurrentUserWallet = crowdsale.ownerAddress === userWalletAddress
            
            return extendedCrowdsale;
        });

        const cards = extendedCrowdsales.map(extendedCrowdsale => {
            return (
                <Grid item xs={12} sm={12} md={6} lg={4} key={extendedCrowdsale.crowdsaleAddress} >
                    <PiggyCard
                        crowdsale={extendedCrowdsale}
                        handleOpen = {() => {this.crowdSaleDetailOpen(extendedCrowdsale)}}
                        // contract={extendedCrowdsale.TOS}
                    />
                </Grid>
            );
        });

        let piggiesDetails = null;
        if(this.state.selectedCrowdSale !== null){
            piggiesDetails = <PiggiesDetails
                                crowdsale={this.state.selectedCrowdsale}
                                closePiggieDetails={this.crowdSaleDetailClose}
                                />
        }

        const styleForFlexboxWithoutScrollbar = {
            margin: 0,
            width: "100%",
        };

        return (
            <>
                 <Grid container>
                    <Grid item xs={12}  align="right">
                        <Typography>{capitalCase(t('openMap'))}
                        <IconButton 
                                color="primary" 
                                size="small" 
                                onClick={this.mapModalOpenHandler} >
                                <Explore/>
                        </IconButton>
                        </Typography>
                    </Grid>
                </Grid>
                <Grid container
                      spacing={1}
                      alignContent="center"
                      wrap="wrap"
                      style={styleForFlexboxWithoutScrollbar}>
                    {cards ? cards.reverse() : null}
                </Grid>
                <SlideModal
                    open={this.state.crowdSaleModalOpened}
                    handleClose={this.crowdSaleDetailClose}
                    title={`Crowdsale: ${this.state.selectedCrowdsale ? this.state.selectedCrowdsale.title : ''} | ${t('modalTitleDetails')}`}
                >
                    {piggiesDetails}
                </SlideModal>
                <SlideModal
                            open={this.state.mapModalOpened}
                            handleClose={this.mapModalCloseHandler}
                            title="Mappa"
                            position= "absolute"
                        >
                        <div style={{marginTop: 60,width: "100%",height: "100%"}}>
                            <MapComponent currentLocation={currentLocation} entities = {crowdsales} pay = {(crowdsale) => this.handleJoin(crowdsale,crowdsales)} type="CC_CROWDFUNDING"/>
                        </div>  
                </SlideModal>
            </>
        );
    };
}


const mapStateToProps = state => {
    return {
        crowdsalesLoading: state.crowdsale.loading,
        crowdsales: state.crowdsale.crowdsales,

        coinList: state.coin.coinListForPiggies,
        coinListLoading: state.coin.loadingCoinListForPiggies,
        
        currentProfile: state.user.currentProfile,
        userWalletAddress: state.web3.currentAccount,
    }
};

const mapDispatchToProps = dispatch => {
    return{
        onGetAllCrowdsalesReset: () => dispatch(actions.crowdsaleGetAllReset()),
        onGetAllCrowdsales: () => dispatch(actions.crowdsaleGetAll()),
        onGetCoinList: () => dispatch(actions.coinGetList(null, false, null, true)),
        onGetCrowdsaleStatus: (crowdsaleId) => dispatch(actions.crowdsaleGetStatus(crowdsaleId)),
        onGetCoinListReset: () => dispatch(actions.coinForPiggiesGetListReset()),
    }
};


export default withTranslation('Piggies')(
    geolocated({
            positionOptions: {
            enableHighAccuracy: false,
        },
        userDecisionTimeout: 5000,
    }) (connect(mapStateToProps, mapDispatchToProps)(Piggies))
);
