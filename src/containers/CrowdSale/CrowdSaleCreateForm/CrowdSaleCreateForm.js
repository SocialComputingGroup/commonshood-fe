import React, {useState, useEffect} from 'react';

import * as actions from "../../../store/actions";
import { connect } from 'react-redux';

import { useTranslation } from "react-i18next";
//import { withRouter } from 'react-router-dom';
import { logger } from '../../../utilities/winstonLogging/winstonInit';

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
import CreationModal from './CreationModal';


const getValidationSchema = (t) =>{
    return Yup.object({
        [formFieldsNames.mainImage]: Yup.mixed()
            .required(t('mainImageRequired'))
            .test(
                'imageFileFormat', 
                t('mainImageUnsupportedFormat', {supportedFormats: constraints.SUPPORTED_IMG_FORMAT_STRINGIFIED}), 
                value => value && constraints.SUPPORTED_IMG_FORMATS.includes(value.type) 
                )
            .test(
                'imageFileSize', 
                t('mainImageFileSize', {maxSize: parseInt(constraints.IMG_FILE_SIZE / 1000000)}), //conversion to give a measure in megabytes 
                value => value && value.size <= constraints.IMG_FILE_SIZE
                ),
        [formFieldsNames.bigTitle]: Yup.string()
            .required(t('titleRequired'))
            .min(constraints.TITLE_MIN_CHARS, t('titleMinChars', {value: constraints.TITLE_MIN_CHARS}))
            .max(constraints.TITLE_MAX_CHARS, t('titleMaxChars', {value: constraints.TITLE_MAX_CHARS})),
        [formFieldsNames.details]: Yup.string()
            .required(t('descriptionRequired'))
            .min(constraints.DESCRIPTION_MIN_CHARS, t('descriptionMinChars', {value: constraints.DESCRIPTION_MIN_CHARS}))
            .max(constraints.DESCRIPTION_MAX_CHARS, t('descriptionMaxChars', {value: constraints.DESCRIPTION_MAX_CHARS})),
        [formFieldsNames.totalEmittedCoin]: Yup.number('Emitted coin must be a number')
            .required()
            .positive(t('emittedCoinMustBePositive'))
            .integer(t('emittedCoinMustBeInteger')),
        [formFieldsNames.acceptedCoinRatio]: Yup.string()
            .required()
            .matches(/^[0-9]+([.,][0-9][0-9]?)?$/, t('acceptedCoinRatioDecimal') )
            .test('parsedPositive', t('acceptedCoinRatioPositive'), value => value && parseFloat(value) > 0),
        [formFieldsNames.startDate]: Yup.date().required(t('startDateRequired')),
        [formFieldsNames.endDate]: Yup.date()
            .required(t('endDateRequired'))
            .test('pastDate', t('endDateMustBeAfterStart'), function(value) {
                return value > this.parent.startDate
            }),
        [formFieldsNames.contract]: Yup.mixed()
            .required(t('contractRequired'))
            .test(
                'contractFileSize', 
                t('contractFileSize', {maxSize: parseInt(constraints.CONTRACT_FILE_SIZE / 1000000)}), 
                value => value && value.size <= constraints.CONTRACT_FILE_SIZE
                )
            .test('contractFileFormat', 
                    t('contractUnsupportedFormat', {supportedFormats: constraints.SUPPORTED_CONTRACT_FORMAT_STRINGIFIED}), 
                    value => value && constraints.SUPPORTED_CONTRACT_FORMATS.includes(value.type) 
                ),
    });
};


const useStyles = makeStyles( (theme) => {
    return createStyles({

    });
});

const CrowdSaleCreateForm = (props) => {
    const {
        onCoinGetAll,
        onCrowdsaleCreateReset,
        userWallet,
        web3,
        coinListLoading,
        coinList,
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
            [formFieldsNames.emittedCoinDisposability]: null,
            [formFieldsNames.acceptedCoinRatio]: 0.01,
            [formFieldsNames.indexAcceptedCoin]: 0,
            [formFieldsNames.acceptedCoin]: {},
            [formFieldsNames.totalAcceptedCoin]: 0.01,
            [formFieldsNames.startDate]: today,
            [formFieldsNames.endDate]: tomorrow,
            [formFieldsNames.contract]: null
        },
        validationSchema: getValidationSchema(t),
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
        if(!coinListLoading){
            onCoinGetAll();
            onCrowdsaleCreateReset();
        }
    }, []);

    useEffect( () => {
        if(coinList != null && coinList.length !== 0){
            logger.info("Reloading tokens and coupons");
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
            <Loading withLoader={true} title={t('loadingCoins')}/>
        )
    }


    return (
        
            <form onSubmit={formik.handleSubmit}>
                <FeaturedCard title={t('describeCrowdSaleTitle')}>
                    <Grid container justify='center' alignItems='flex-end'>
                    {
                        {
                            0: <FormStep0 formik={formik} setStep={setStep} />,
                            1: <FormStep1 formik={formik} setStep={setStep} ownedCoupons={ownedCoupons} currentAccount={userWallet} web3={web3}/>,
                            2: <FormStep2 formik={formik} setStep={setStep} allTokens={allTokens} />,
                            3: <FormStep3 formik={formik} setStep={setStep} openModal={() => setModalOpen(true)} />
                        }[step] || <div />
                    }
                    <CreationModal formik={formik} modalOpen={modalOpen} closeModal={ () => setModalOpen(false)}/>
                    </Grid>
                </FeaturedCard>
            </form>
     
        
    );
};


const mapStateToProps = state => {
    return {
        coinListLoading: state.coin.loadingCoinListForPiggies,
        coinList: state.coin.coinListForPiggies,
        userWallet: state.web3.currentAccount,
        web3: state.web3.web3Instance,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onCoinGetListReset: () => dispatch(actions.coinGetListReset()),
        onCoinGetAll: () => dispatch(actions.coinGetList(null, false, false, true, null)),
        onCreateCrowdSale: (crowdsaleData) => dispatch(actions.crowdsaleCreate(crowdsaleData)),
        onCrowdsaleCreateReset: () => dispatch(actions.crowdsaleCreateReset()),
    }
};

export default connect(mapStateToProps,mapDispatchToProps) (
    CrowdSaleCreateForm
);