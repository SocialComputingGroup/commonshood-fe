import React from 'react';
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import {Button, Divider, Grid, Typography} from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/core/styles';

import { formFieldsNames} from './configForm';
import ZoomModal from '../../../components/UI/Modal/ZoomModal/ZoomModal';

import * as actions from "../../../store/actions";
import { connect } from 'react-redux';

import Loading from '../../../components/UI/Loading/Loading.js'

const useStyles = makeStyles( (theme) => {
    return createStyles({
        typographyCreationModal: {
            display: "inline-block",
            marginTop: "10px",
            marginBottom: "10px"
        }
    });
});

const CreationModal = (props) => {
    const {
        formik,
        modalOpen,
        closeModal,
        crowdsaleCreationLoading,
        crowdsaleCreationSuccess,
        crowdsaleCreationError,
        crowdsaleCreationResetCall
    } = props;

    const {t} = useTranslation('CrowdSaleCreateForm');
    const history = useHistory();
    const classes = useStyles();

    const handleSubmit = () => {
        formik.handleSubmit();
    };

    let modalTitle = t('creationModalTitle');
    let modalContent = (
        <>
            <Typography className={classes.typographyCreationModal}>
                <strong>{t('mainImage')}:</strong> {formik.values[formFieldsNames.mainImage]?.name}
            </Typography>
            <Divider />
            <Typography className={classes.typographyCreationModal}>
                <strong>{t('title')}:</strong> {formik.values[formFieldsNames.bigTitle]}
            </Typography>
            <Divider />
            <Typography className={classes.typographyCreationModal}>
                <strong>{t('description')}:</strong> {formik.values[formFieldsNames.details]}
            </Typography>
            <Divider />
            <Typography className={classes.typographyCreationModal}>
                <strong>{t('couponTicker')}:</strong> {formik.values[formFieldsNames.emittedCoin]?.symbol}
            </Typography>
            <Divider />
            <Typography className={classes.typographyCreationModal}>
                <strong>{t('couponQuantity')}:</strong> {formik.values[formFieldsNames.totalEmittedCoin]} {formik.values[formFieldsNames.emittedCoin]?.symbol}
            </Typography>
            <Divider />
            {/* <Typography className={classes.typographyCreationModal}>
                <strong></strong> {formik.values[formFieldsNames.forEachEmittedCoin]}
            </Typography> 
            <Divider />
            */}
            <Typography className={classes.typographyCreationModal}>
                <strong>{t('couponTicker')}:</strong> {formik.values[formFieldsNames.acceptedCoin]?.symbol}
            </Typography>
            <Divider />
            <Typography className={classes.typographyCreationModal}>
                <strong>{t('coinsRatio')}:</strong> {formik.values[formFieldsNames.acceptedCoinRatio]} {formik.values[formFieldsNames.acceptedCoin]?.symbol}
            </Typography>
            <Divider />
            <Typography className={classes.typographyCreationModal}>
                <strong>{t('totalCoins')}:</strong> {formik.values[formFieldsNames.totalAcceptedCoin]} {formik.values[formFieldsNames.acceptedCoin]?.symbol}
            </Typography>
            <Divider />
            <Typography className={classes.typographyCreationModal}>
                <strong>{t('startingDate')}:</strong> {formik.values[formFieldsNames.startDate]}
            </Typography>
            <Divider />
            <Typography className={classes.typographyCreationModal}>
                <strong>{t('endingDate')}:</strong> {formik.values[formFieldsNames.endDate]}
            </Typography>
            <Divider />
            <Typography className={classes.typographyCreationModal}>
                <strong>{t('contractFileName')}</strong> {formik.values[formFieldsNames.contract]?.name}
            </Typography>
            <Divider />
        </>
    );


    let buttons = (
        <Grid container justify='center' alignItems='flex-start'>
            <Grid item xs={12} md={6}>
                <Button
                    variant='contained'
                    color='primary'
                    style={{marginTop: "10px"}}
                    onClick={() => closeModal()}
                >
                    {t('back')}
                </Button>
            </Grid>
            <Grid item xs={12} md={6}>
                <Button
                    variant='contained'
                    color='primary'
                    style={{marginTop: "10px"}}
                    onClick={handleSubmit}
                >
                    {t('confirm')}
                </Button>
            </Grid>
        </Grid>
    );


    //case in which we have errors
    if(Object.keys(formik.errors).length !== 0){ //this is an easy way to check if we got any error in this form
        modalTitle = "Errors encountered";
        modalContent = Object.entries(formik.errors).map( ([key, value], index) => {
            return (
                <div key={key}>
                    <Typography className={classes.typographyCreationModal} color="error">
                        <strong>{value}</strong>
                    </Typography>
                    <Divider />
                </div>
            )
        });
        buttons = (
            <Grid container justify='center' alignItems='flex-start'>
                <Grid item xs={12} md={6}>
                    <Button
                        variant='contained'
                        color='primary'
                        style={{marginTop: "10px"}}
                        onClick={() => closeModal()}
                    >
                        {t('back')}
                    </Button>
                </Grid>
            </Grid>
        );
    }


    if(crowdsaleCreationLoading){//case in which we are awaiting for the transaction to be mined
        modalContent = (
            <Loading title={`${t('waitTransactionMining')}...`} withLoader={true} />
        );
        buttons = null;
    }else if(crowdsaleCreationSuccess){ //case in which crowdsale was created correctly on bc
        let mintNeeded = null;
        if(
            formik.values[formFieldsNames.emittedCoinDisposability] !== null &&
            parseInt(formik.values[formFieldsNames.totalEmittedCoin]) > formik.values[formFieldsNames.emittedCoinDisposability]
        ) { //user need to mint more coupons to start this crowdsale
            mintNeeded = (
                <>
                    <Typography variant="h5" className={classes.typographyCreationModal} color="error">
                        <strong>{`${t('emissionExcedingBalance')}.`}</strong>
                    </Typography>
                    <Divider />
                </>
            );
        }

        modalContent = (
            <>
                <Typography variant="h5" className={classes.typographyCreationModal}>
                    <strong>{`${t('crowdsaleSuccessfullyCreated')}.`}</strong>
                </Typography>
                <Divider />
                <Typography variant="h5" className={classes.typographyCreationModal}>
                    <strong>{`${t('successExtraInfo')}.`}</strong>
                </Typography>
                <Divider />
                {mintNeeded}
            </>
        );
        buttons = (
            <Grid container justify='center' alignItems='flex-start'>
                <Grid item xs={12}>
                    <Button
                        variant='contained'
                        color='primary'
                        style={{marginTop: "10px"}}
                        onClick={() => {
                            history.push("/");
                            props.showCrowdsalesPage();
                        }}
                    >
                        {t('loadCoupons')}
                    </Button>
                </Grid>
                <Grid item xs={12}>
                    <Button
                        variant='contained'
                        color='primary'
                        style={{marginTop: "10px"}}
                        onClick={() => history.push("/")}
                    >
                        {t('goHome')}
                    </Button>
                </Grid>
            </Grid>
        )
    }else if(crowdsaleCreationError){ //case in which there was an error creating the crowdsale
        modalContent = (
            <>
                <Typography variant="h5" className={classes.typographyCreationModal} color="error">
                    <strong>{t('crowdsaleCreationError')}</strong>
                </Typography>
                <Divider />
            </>
        );
        buttons = (
            <Grid container justify='center' alignItems='flex-start'>
                <Grid item xs={12} md={6}>
                    <Button
                        variant='contained'
                        color='primary'
                        style={{marginTop: "10px"}}
                        onClick={() => {
                            crowdsaleCreationResetCall();
                            closeModal();
                        }}
                    >
                        {t('back')}
                    </Button>
                </Grid>
            </Grid>
        );
    }

    //general case
    return (
        <ZoomModal
            title={modalTitle}
            open={modalOpen}
            //onClose={() => this.handleCreationModalClose()}
            disableBackdropClick
            disableEscapeKeyDown

        >
            {modalContent}
            {buttons}

        </ZoomModal>
    );
};


const mapStateToProps = state => {
    return {
        crowdsaleCreationSuccess: state.crowdsale.crowdSaleCreated,
        crowdsaleCreationError: state.crowdsale.error,
        crowdsaleCreationLoading: state.crowdsale.loading,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        crowdsaleCreationResetCall: () => dispatch(actions.crowdsaleCreateReset()),
        showCrowdsalesPage: () => dispatch(actions.handleBottomMenuIndexChange(1)),
    }
};

export default connect(mapStateToProps,mapDispatchToProps) (
    CreationModal
);
