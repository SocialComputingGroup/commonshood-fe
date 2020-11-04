import React, {useEffect, useState} from 'react';
import {useTranslation} from "react-i18next";


//qr reader
import ReactQrReader from 'react-qr-reader';
//qr generator
import QrGenerator from 'qrcode.react';

import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";


import place_placeholder from "../../assets/img/home-green.png";

import {logger} from '../../utilities/winstonLogging/winstonInit';
import {connect} from "react-redux";
import * as actions from "../../store/actions";

const Qr = (props) => {
    const {
        profile,
        preselectContact, //redux state
        changeIndex, //redux action
        bottomMenuActiveIndex, //redux state
        closeParentModal, //passed from parent component
        getUserFromId, //redux action
        user, //redux state
        userIsFound, //redux state
        getDaoFromId, //redux action
        dao, //redux state
        daoIsFound, //redux state
    } = props;

    const {t} = useTranslation("qr");
    const [qrResult, changeQrResult] = useState(null);
    const [newQrRead, setNewQrRead] = useState(false);
    const [isShowScan, setShowScan] = useState(true); //true shows the scan, false shows the personal qr code
    const [errorMessage, setErrorMessage] = useState(null);


    let buttonText = '';


    useEffect( () => {
        props.resetDao();
        props.resetUser();

        return () => { // == componentWillUmount
            props.resetDao();
            props.resetUser();
        }
    }, []); //empty array == runs one time == as componentDidMount

    useEffect( () => {
        if(user != null) {
            const contact = {
                id: user.id,
                name: user.name,
                realm: 'user',
                icon: user.avatar
            };
            logger.info('user contact read => ', contact);
            preselectContact(contact);
            if (bottomMenuActiveIndex !== 0) {
                changeIndex();
            }
            closeParentModal();
        }
    }, [user]); //user changed

    useEffect( () => {
        if( dao != null){
            const contact = {
                firstLifePlaceID: dao.firstLifePlaceID,
                name: dao.name,
                realm: 'dao',
                icon: place_placeholder
            };
            logger.info('dao contact read => ', contact);
            preselectContact(contact);
            if (bottomMenuActiveIndex !== 0) {
                changeIndex();
            }
            closeParentModal();
        }
    }, [dao]);

    if(userIsFound === false && newQrRead){
        setErrorMessage(
            <Typography variant="caption" color="error" >
                {t('userNotFound')}
            </Typography>
        );
        setNewQrRead(false);
    }
    if(daoIsFound === false && newQrRead){
        setErrorMessage(
            <Typography variant="caption" color="error" >
                {t('daoNotFound')}
            </Typography>
        );
        setNewQrRead(false);
    }

    const handleScan = (data) => { //data is a string here, &&& is the separator
        if(data &&
            (qrResult !== data)){ //we got a new qr code scan with data different from the last one
            logger.info("got new qr code");
            setErrorMessage(null);
            setNewQrRead(true);
            props.resetUser();
            props.resetDao();

            changeQrResult(data);

            if(data.includes('&&&')) {
                const [id, realm] = data.split('&&&');
                //prepare object to be passed to coinSend, note the difference on which is the id
                logger.warn("id -> ", id);
                logger.warn("realm -> ", realm);

                if (id !== profile.id) { // avoid to open a form to send coin to himself
                    if (realm === "dao") {
                        getDaoFromId(id);
                    } else { //user
                        getUserFromId(id);
                    }
                } else { // if we are here the QR code read is the one === to the current profile of the logged user
                    logger.info("qr code of logged user");
                    setErrorMessage(
                        <Typography variant="caption" color="error" >
                            {t('cantSendCoinToYourself')}
                        </Typography>
                    );
                }
            }
        }
    };

    const handleScanError = (err) => {
        logger.error('Qr Reader Failure', err);
        setErrorMessage(
            <Typography variant="caption" color="error" >
                {t('hwNotSupported')}
            </Typography>
            );
    };


    let content = null;
    if(isShowScan){
        buttonText = t("showMyQrCode");
        content = (
            <>
                <Grid item xs={12} align="center">
                    <Typography variant="overline">
                        {t("scanInstructions")}
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    {errorMessage}
                </Grid>
                <Grid item xs={12} align="center">
                    <ReactQrReader
                        delay={300}
                        onError={handleScanError}
                        onScan={handleScan}
                        style={{
                            maxWidth: "500px",
                            maxHeight: "500px",
                        }}
                    />
                </Grid>
            </>
        );
    }else{
        buttonText = t("showQrCodeReader");
        const {
            id,
            name,
            realm,
            avatar,
        } = profile;

        let yourQrCodeText = '';
        let stringToQRify = '';
        if(realm === "dao"){
            yourQrCodeText = (
                <p>
                    {`${t("userQrCodeText")}`} <strong>{name}</strong>
                </p>
            );
            stringToQRify = `${id}&&&${realm}`;
        }else{ //user
            yourQrCodeText = (
                <p>
                    {`${t("daoQrCodeText")}`} <strong>{name}</strong>
                </p>
            );
            stringToQRify = `${id}&&&${realm}`;
        }
        content = (
            <>
                <Grid item xs={12} align="center">
                    <QrGenerator
                        value={stringToQRify}
                        size={250}
                        includeMargin={true}
                    />
                </Grid>
                <Grid item xs={12} align="center">
                    <Typography variant="overline">
                        {yourQrCodeText}
                    </Typography>
                </Grid>
            </>
        );
    }


    return(
        <Grid
            container
            direction="row"
            justify="center"
            alignItems="flex-start"
            spacing={3}
            style={{
                margin: "100px auto auto auto",
                width: "100%"
            }}
        >
            {content}
            <Grid item xs={12} align="center">
                <Button
                    onClick={() => setShowScan(!isShowScan)}
                    variant="contained"
                    color="primary"
                >
                    {buttonText}
                </Button>
            </Grid>
        </Grid>
    );
};


const mapStateToProps = state => {
    return {
        profile: state.user.currentProfile,
        bottomMenuActiveIndex: state.ui.bottomMenuActiveIndex,
        user: state.user.user,
        userIsFound: state.user.userIsFound,
        dao: state.dao.currentDao,
        daoIsFound: state.dao.currentDaoIsFound
    }
};
const mapDispatchToProps = dispatch => {
    return {
        preselectContact: (contact) => dispatch(actions.userPreselectContact(contact)),
        resetUser: () => dispatch(actions.userDelete()),
        getUserFromId: (id) => dispatch(actions.userGetDataFromId(id)),
        resetDao: () => dispatch(actions.daoGetDelete()),
        getDaoFromId: (daoId) => dispatch(actions.daoGetDataFromId(daoId)),
        changeIndex: () => dispatch(actions.handleBottomMenuIndexChange(0)), // 0 for wallet
        //removePreselectedContact: () => dispatch(actions.userRemovePreselectedContact()),
    }
};

export default  connect(mapStateToProps,mapDispatchToProps) (
    Qr
);
