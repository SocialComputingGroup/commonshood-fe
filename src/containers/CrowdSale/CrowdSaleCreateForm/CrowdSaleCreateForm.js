
import React, {useState, useEffect} from 'react';

import * as actions from "../../../store/actions";
import { useTranslation } from "react-i18next";
//import { withRouter } from 'react-router-dom';
import { logger } from '../../../utilities/winstonLogging/winstonInit';
import { connect } from 'react-redux';

import {assetsType} from '../../../config/assets';

import FeaturedCard from '../../../components/UI/Card/FeaturedCard/FeaturedCard';
import {Button, Divider, Grid, Typography} from '@material-ui/core';

import { makeStyles, createStyles } from '@material-ui/core/styles';
import { useFormik, Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { formFieldsNames, constraints} from './configForm';

import Loading from '../../../components/UI/Loading/Loading.js'

import FormStep0 from './steps/FormStep0';
import FormStep1 from './steps/FormStep1';
import FormStep2 from './steps/FormStep2';
import FormStep3 from './steps/FormStep3';

import ZoomModal from '../../../components/UI/Modal/ZoomModal/ZoomModal';


const validationSchema = Yup.object({
    [formFieldsNames.mainImage]: Yup.mixed()
        .required('A main image is required')
        .test('imageFileFormat', "Unsupported File Format", value => value && constraints.SUPPORTED_IMG_FORMATS.includes(value.type) )
        .test('imageFileSize', "File Size is too large", value => value && value.size <= constraints.IMG_FILE_SIZE),
    [formFieldsNames.bigTitle]: Yup.string()
        .min(5, "must be 5 characters or more")
        .max(40, "must be 40 characters or less")
        .required('A title is required'),
    [formFieldsNames.details]: Yup.string()
        .min(5, "must be 5 characters or more")
        .max(500, "must be 500 characters or less")
        .required('A description is required'),    
    [formFieldsNames.totalEmittedCoin]: Yup.number('Emitted coin must be a number')
        .required()
        .positive('Emitted coin must be a positive number')
        .integer('Emitted coin must be a integer'),
    [formFieldsNames.acceptedCoinRatio]: Yup.string()
        .required()
        .matches(/^[0-9]+([.,][0-9][0-9]?)?$/, 'Must be a decimal number with 2 decimals' )
        .test('parsedPositive', 'Must be a positive number', value => value && parseFloat(value) > 0),
    [formFieldsNames.startDate]: Yup.date().required('Start Date is Required'),
    [formFieldsNames.endDate]: Yup.date()
        .required('End date is required')
        .test('pastDate', "Can't end before start", function(value) {
            return value > this.parent.startDate
        }),
    [formFieldsNames.contract]: Yup.mixed()
        .required('A contract is required')
        .test('contractFileSize', "File Size is too large", value => value && value.size <= constraints.CONTRACT_FILE_SIZE)
        .test('contractFileFormat', 
                `Unsupported File Format. Must be: ${constraints.SUPPORTED_CONTRACT_FORMATS}`, 
                value => value && constraints.SUPPORTED_CONTRACT_FORMATS.includes(value.type) 
            ),
});


const useStyles = makeStyles( (theme) => {
    return createStyles({
        typographyCreationModal: {
            display: "inline-block",
            marginTop: "10px",
            marginBottom: "10px"
        }
    });
});

const CrowdSaleCreateForm = (props) => {
    const {
        onCoinGetAll,
        coinListLoading,
        coinList,
        userWallet
    } = props;
    const {t} = useTranslation('CrowdSaleCreateForm');
    const classes = useStyles();

    const [step, setStep] = useState(0); //this represents the form "parts"
    const [ownedCoupons, setOwnedCoupons] = useState([]);
    const [allTokens, setAllTokens] = useState([]);

    const today = new Date().toISOString().substring(0,10);
    let tomorrow = new Date();
    tomorrow.setDate( ( new Date() ).getDate() +1);
    tomorrow = tomorrow.toISOString().substring(0,10);

    const [modalOpen, setModalOpen] = useState(false);

    const formik = useFormik({
        initialValues: {
            [formFieldsNames.mainImage]: null,
            [formFieldsNames.bigTitle]: "",
            [formFieldsNames.details]: "",
            [formFieldsNames.totalEmittedCoin]: 1,
            [formFieldsNames.indexEmittedCoin]: 0,
            [formFieldsNames.emittedCoin]: {},
            [formFieldsNames.forEachEmittedCoin]: 1, //fixed
            [formFieldsNames.acceptedCoinRatio]: 0.01,
            [formFieldsNames.indexAcceptedCoin]: 0,
            [formFieldsNames.acceptedCoin]: {},
            [formFieldsNames.totalAcceptedCoin]: 0.01,
            [formFieldsNames.startDate]: today,
            [formFieldsNames.endDate]: tomorrow,
            [formFieldsNames.contract]: null
        },
        validationSchema,
        onSubmit: (values) => {
            logger.info("CrowdsaleCreateForm form values: ", values);
            const {
                onCreateCrowdSale
            } = props;
            onCreateCrowdSale(values);
        }
    });

    useEffect( () => {
        console.log("coinGetAll")
        if(!coinListLoading)
            onCoinGetAll();
    }, []);

    useEffect( () => {
        if(coinList != null && coinList.length !== 0){
            setAllTokens( 
                coinList
                    .filter( coin => coin.type === assetsType.token.name ) 
                    .sort( (a,b) => a.symbol.localeCompare(b.symbol))
                ); 
            setOwnedCoupons( 
                coinList
                    .filter( coin => coin.type === assetsType.goods.name )
                    .filter( coupon => coupon.addressOfOwner === userWallet )
                    .sort( (a,b) => a.symbol.localeCompare(b.symbol))
            );
        }
    }, [coinList]);

    logger.info('alltokens => ', allTokens);
    logger.info('ownedCoupons =>', ownedCoupons);
    logger.info("CrowdsaleCreateForm form values: ", formik.values);
    logger.info("Errors: ", formik.errors);

    if(coinList === null || coinList.length === 0){
        return (
            <Loading withLoader={true} />
        )
    }

    let modalTitle = t('creationModalTitle');
    const creationModal = 
     (
        <ZoomModal
                title={modalTitle}
                open={modalOpen}
                //onClose={() => this.handleCreationModalClose()}
                disableBackdropClick
                disableEscapeKeyDown

            >
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

                <Grid container justify='center' alignItems='flex-start'>
                    <Grid item xs={12} md={6}>
                        <Button 
                            variant='contained'
                            color='primary'
                            style={{marginTop: "10px"}}
                            onClick={() => setModalOpen(false)}
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
                            >
                            CONFIRM
                        </Button>
                    </Grid>
                </Grid>

            </ZoomModal>
    );

    return (
        
            <form onSubmit={formik.handleSubmit}>
                <FeaturedCard title={t('describeCrowdSaleTitle')}>
                    <Grid container justify='center' alignItems='flex-end'>
                    {
                        {
                            0: <FormStep0 formik={formik} setStep={setStep} />,
                            1: <FormStep1 formik={formik} setStep={setStep} ownedCoupons={ownedCoupons} />,
                            2: <FormStep2 formik={formik} setStep={setStep} allTokens={allTokens} />,
                            3: <FormStep3 formik={formik} setStep={setStep} openModal={() => setModalOpen(true)} />
                        }[step] || <div />
                    }
                    {creationModal}
                    </Grid>
                </FeaturedCard>
            </form>
     
        
    );
};


const mapStateToProps = state => {
    return {
        // fileLoading: state.file.loading,
        // fileList: state.file.fileList,
        // loading: state.coin.loading,
        // coinError: state.coin.error,
        coinListLoading: state.coin.loadingCoinListForPiggies,
        coinList: state.coin.coinListForPiggies,
        // fileData: state.file.fileData,
        // fileError: state.file.error,
        // profile: state.user.currentProfile,
        // creationSuccess: state.crowdsale.crowdSaleCreated,
        // creationFailureError: state.crowdsale.error,
        // crowdsaleLoading: state.crowdsale.loading,
        userWallet: state.web3.currentAccount
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onCoinGetListReset: () => dispatch(actions.coinGetListReset()),
        onCoinGetAll: () => dispatch(actions.coinGetList(null, false, false, true, null)),
        onFileGetList: (hashArray) => dispatch(actions.fileGetList(hashArray)),
        onFileGetListReset: () => dispatch(actions.fileGetListReset()),
        onFileUpload: (file) => dispatch(actions.fileUpload(file)),
        onCreateCrowdSale: (crowdsaleData) => dispatch(actions.crowdsaleCreate(crowdsaleData)),
        onCrowdsaleCreateReset: () => dispatch(actions.crowdsaleCreateReset()),

    }
};

export default connect(mapStateToProps,mapDispatchToProps) (
    CrowdSaleCreateForm
    );