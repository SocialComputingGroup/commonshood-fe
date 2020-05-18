
import React, {useState} from 'react';

import * as actions from "../../../store/actions";
import { useTranslation } from "react-i18next";
//import { withRouter } from 'react-router-dom';
import { logger } from '../../../utilities/winstonLogging/winstonInit';
import { connect } from 'react-redux';

import FeaturedCard from '../../../components/UI/Card/FeaturedCard/FeaturedCard';
import Typography from '@material-ui/core/Typography';
import Grid from "@material-ui/core/Grid";

import { useFormik, Formik, Field, ErrorMessage } from 'formik';
import { formFieldsNames, formFieldsTypes} from './configForm';

import FormStep0 from './steps/FormStep0';
//import CustomImageInput from '../../../components/UI/Form/Upload/CustomImageInput/CustomImageInput';

const validationSchema = {

};


const FormStep1 = (props) => {
    const {
        formik,
        setStep
    } = props;

    logger.info("CrowdsaleCreateForm form values: ", formik.values);
    return (
        <button onClick={ () => setStep(0)}>GO PREV</button>
    );
}

const CrowdSaleCreateForm = (props) => {
    const {t} = useTranslation('CrowdSaleCreateForm');

    const [step, setStep] = useState(0); //this represents the form "parts"

    const formik = useFormik({
        initialValues: {
            [formFieldsNames.mainImage]: null,
        },
        onSubmit: (values) => {
            logger.info("CrowdsaleCreateForm form values: ", values);
        }
    });

    return (
        <form onSubmit={formik.handleSubmit}>
            <FeaturedCard title={t('describeCrowdSaleTitle')}>
                <Grid container justify='center' alignItems='flex-end'>
                {
                    {
                        0: <FormStep0 formik={formik} setStep={setStep} />,
                        1: <FormStep1 formik={formik} setStep={setStep} />
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
        // coinList: state.coin.coinList,
        // fileData: state.file.fileData,
        // fileError: state.file.error,
        // profile: state.user.currentProfile,
        // creationSuccess: state.crowdsale.crowdSaleCreated,
        // creationFailureError: state.crowdsale.error,
        // crowdsaleLoading: state.crowdsale.loading,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onCoinGetListReset: () => dispatch(actions.coinGetListReset()),
        onCoinGetAllOwned: () => dispatch (actions.coinGetList(null, true, true, true)),
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