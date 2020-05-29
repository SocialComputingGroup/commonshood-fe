
import React, {useState, useEffect} from 'react';

import * as actions from "../../../store/actions";
import { useTranslation } from "react-i18next";
//import { withRouter } from 'react-router-dom';
import { logger } from '../../../utilities/winstonLogging/winstonInit';
import { connect } from 'react-redux';

import {assetsType} from '../../../config/assets';

import FeaturedCard from '../../../components/UI/Card/FeaturedCard/FeaturedCard';
import Typography from '@material-ui/core/Typography';
import Grid from "@material-ui/core/Grid";

import { useFormik, Formik, Field, ErrorMessage } from 'formik';
import { formFieldsNames, formFieldsTypes} from './configForm';

import Loading from '../../../components/UI/Loading/Loading.js'

import FormStep0 from './steps/FormStep0';
import FormStep1 from './steps/FormStep1';
//import CustomImageInput from '../../../components/UI/Form/Upload/CustomImageInput/CustomImageInput';

const validationSchema = {

};

const CrowdSaleCreateForm = (props) => {
    const {
        onCoinGetAll,
        coinList,
        userWallet
    } = props;
    const {t} = useTranslation('CrowdSaleCreateForm');

    const [step, setStep] = useState(0); //this represents the form "parts"
    const [ownedCoupons, setOwnedCoupons] = useState([]);
    const [allTokens, setAllTokens] = useState([]);

    const formik = useFormik({
        initialValues: {
            [formFieldsNames.mainImage]: null,
            [formFieldsNames.bigTitle]: "",
            [formFieldsNames.details]: "",
            [formFieldsNames.totalEmittedCoin]: 1,
            [formFieldsNames.emittedCoin]: 0,
        },
        onSubmit: (values) => {
            logger.info("CrowdsaleCreateForm form values: ", values);
        }
    });

    useEffect( () => {
        onCoinGetAll();
    }, []);

    useEffect( () => {
        if(coinList != null && coinList.length !== 0){
            setAllTokens( coinList.filter( coin => coin.type === assetsType.token.name ) );
            setOwnedCoupons( 
                coinList
                    .filter( coin => coin.type === assetsType.goods.name )
                    .filter( coupon => coupon.addressOfOwner === userWallet )
            );
        }
    }, [coinList]);

    logger.info('alltokens => ', allTokens);
    logger.info('ownedCoupons =>', ownedCoupons);
    logger.info("CrowdsaleCreateForm form values: ", formik.values);

    if(coinList === null || coinList.length === 0){
        return (
            <Loading withLoader={true} />
        )
    }

    return (
        <form onSubmit={formik.handleSubmit}>
            <FeaturedCard title={t('describeCrowdSaleTitle')}>
                <Grid container justify='center' alignItems='flex-end'>
                {
                    {
                        0: <FormStep0 formik={formik} setStep={setStep} />,
                        1: <FormStep1 formik={formik} setStep={setStep} ownedCoupons={ownedCoupons} />
                    }[step] || <div />
                }
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