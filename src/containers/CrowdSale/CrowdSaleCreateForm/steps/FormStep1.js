import React, { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { formFieldsNames } from '../configForm';
import { logger } from '../../../../utilities/winstonLogging/winstonInit';

import { makeStyles, createStyles } from '@material-ui/core/styles';
import Button from "@material-ui/core/Button";

const FormStep1 = (props) => {
    const {
        formik,
        setStep
    } = props;

    const { t } = useTranslation('CrowdSaleCreateForm');

    return (
        <button onClick={ () => setStep(0)}>GO PREV</button>
    );
}

export default FormStep1;
