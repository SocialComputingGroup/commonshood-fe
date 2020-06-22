import React from 'react';
import { useTranslation } from "react-i18next";

import {Button, Divider, Grid, Typography} from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/core/styles';

import { formFieldsNames} from './configForm';
import ZoomModal from '../../../components/UI/Modal/ZoomModal/ZoomModal';


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
    } = props;

    const {t} = useTranslation('CrowdSaleCreateForm');
    const classes = useStyles();

    let modalTitle = t('creationModalTitle');
    let modalContent = (
        <>
            <Typography className={classes.typographyCreationModal}>
                <strong>Main image:</strong> {formik.values[formFieldsNames.mainImage]?.name}
            </Typography>
            <Divider />
            <Typography className={classes.typographyCreationModal}>
                <strong>Title:</strong> {formik.values[formFieldsNames.bigTitle]}
            </Typography>
            <Divider />
            <Typography className={classes.typographyCreationModal}>
                <strong>Description:</strong> {formik.values[formFieldsNames.details]}
            </Typography>
            <Divider />
            <Typography className={classes.typographyCreationModal}>
                <strong>Symbol of the Coupon I am giving out:</strong> {formik.values[formFieldsNames.emittedCoin]?.symbol}
            </Typography>
            <Divider />
            <Typography className={classes.typographyCreationModal}>
                <strong>Number of coupons I am distributing:</strong> {formik.values[formFieldsNames.totalEmittedCoin]} {formik.values[formFieldsNames.emittedCoin]?.symbol}
            </Typography>
            <Divider />
            {/* <Typography className={classes.typographyCreationModal}>
                <strong></strong> {formik.values[formFieldsNames.forEachEmittedCoin]}
            </Typography> 
            <Divider />
            */}
            <Typography className={classes.typographyCreationModal}>
                <strong>Symbol of the Coin I am accepting:</strong> {formik.values[formFieldsNames.acceptedCoin]?.symbol}
            </Typography>
            <Divider />
            <Typography className={classes.typographyCreationModal}>
                <strong>How many coin I accept for each of my coupons:</strong> {formik.values[formFieldsNames.acceptedCoinRatio]} {formik.values[formFieldsNames.acceptedCoin]?.symbol}
            </Typography>
            <Divider />
            <Typography className={classes.typographyCreationModal}>
                <strong>I'll receive a total of </strong> {formik.values[formFieldsNames.totalAcceptedCoin]} {formik.values[formFieldsNames.acceptedCoin]?.symbol}
            </Typography>
            <Divider />
            <Typography className={classes.typographyCreationModal}>
                <strong>Starting date:</strong> {formik.values[formFieldsNames.startDate]}
            </Typography>
            <Divider />
            <Typography className={classes.typographyCreationModal}>
                <strong>Ending date:</strong> {formik.values[formFieldsNames.endDate]}
            </Typography>
            <Divider />
            <Typography className={classes.typographyCreationModal}>
                <strong>Contract file name:</strong> {formik.values[formFieldsNames.contract]?.name}
            </Typography>
            <Divider />
        </>
    );
    let disableSubmitButton = false;

    if(Object.keys(formik.errors).length !== 0){ //this is an easy way to check if we got any error in this form
        modalTitle = "Errors encountered";
        modalContent = Object.entries(formik.errors).map( ([key, value], index) => {
            return (
                <>
                    <Typography className={classes.typographyCreationModal} color="error">
                        <strong>{value}</strong>
                    </Typography>
                    <Divider />
                </>
            )
        });
        disableSubmitButton = true;
    }

    return (
        <ZoomModal
            title={modalTitle}
            open={modalOpen}
            //onClose={() => this.handleCreationModalClose()}
            disableBackdropClick
            disableEscapeKeyDown

        >
            {modalContent}

            <Grid container justify='center' alignItems='flex-start'>
                <Grid item xs={12} md={6}>
                    <Button 
                        variant='contained'
                        color='primary'
                        style={{marginTop: "10px"}}
                        onClick={() => closeModal()}
                        >
                        BACK
                    </Button>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Button 
                        variant='contained'
                        color='primary'
                        style={{marginTop: "10px"}}
                        onClick={ () => console.log("CONFIRM")}
                        disabled={disableSubmitButton}
                        >
                        CONFIRM
                    </Button>
                </Grid>
            </Grid>

        </ZoomModal>
    );
};

export default CreationModal;